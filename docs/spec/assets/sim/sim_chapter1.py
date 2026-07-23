#!/usr/bin/env python3
"""
IncrementalFantasy - Kampf- & Pacing-Simulator fuer Kapitel 1 (Zyklus 1).
Validiert die vorgeschlagenen Formeln/Startwerte und liefert Kampfdauern
und Pacing-Timings je Zone/Region. Deterministisch (kein RNG).

Tickbasierte ATB-Simulation, dt = 0.1 s.
"""

import math

DT = 0.1
BASE_T = 2.0          # ATB-Basisintervall bei SPD 100
G = 1.07              # Zonen-Wachstumsfaktor
SHOCK_THRESHOLD = 100
SHOCK_WINDOW = 6.0    # s
SHOCK_DMG_MULT = 2.0
SHOCK_ATB_MULT = 0.3  # geschockter Gegner handelt stark verlangsamt

def phys_dmg(atk, deff, ignore_def=False):
    d = 0 if ignore_def else deff
    return max(1, round(atk * atk / (atk + d)))

def atb_interval(spd):
    return BASE_T * 100.0 / spd

class Fighter:
    def __init__(self, name, hp, mp, atk, mag, deff, spd, side, kind="char"):
        self.name = name
        self.max_hp = hp; self.hp = hp
        self.max_mp = mp; self.mp = mp
        self.atk = atk; self.mag = mag; self.deff = deff; self.spd = spd
        self.side = side; self.kind = kind
        self.atb = 0.0; self.limit = 0.0
        self.shock = 0.0; self.shock_timer = 0.0
        self.poison_ticks = 0; self.poison_dmg = 0
        self.suppress = 0.0; self.actions_done = 0; self.fled = False
        self.tag = ""; self.level = 1
        self.exp = 0; self.gil = 0

    @property
    def alive(self):
        return self.hp > 0 and not self.fled

    def atb_full_time(self):
        rate = 1.0
        if self.side == "enemy" and self.shock_timer > 0:
            rate *= SHOCK_ATB_MULT
        if self.suppress > 0:
            rate *= 0.5
        return atb_interval(self.spd) / rate

CHAR_BASE = {
    "Claude": dict(hp=110, mp=20, atk=14, mag=6,  deff=4, spd=100),
    "Barrel": dict(hp=140, mp=20, atk=11, mag=5,  deff=8, spd=80),
    "Tofa":   dict(hp=95,  mp=20, atk=12, mag=5,  deff=3, spd=130),
    "Arris":  dict(hp=80,  mp=30, atk=7,  mag=14, deff=3, spd=95),
}
GROW = dict(hp=1.09, atk=1.055, mag=1.055, deff=1.05, spd=1.00)

def make_char(name, level):
    b = CHAR_BASE[name]
    f = Fighter(name,
        hp=round(b["hp"] * GROW["hp"]**(level-1)),
        mp=round(b["mp"] * (1 + 0.03*(level-1))),
        atk=round(b["atk"] * GROW["atk"]**(level-1)),
        mag=round(b["mag"] * GROW["mag"]**(level-1)),
        deff=round(b["deff"] * GROW["deff"]**(level-1)),
        spd=round(b["spd"] * GROW["spd"]**(level-1)),
        side="party")
    f.level = level
    return f

def apply_weapon(f, tier):
    f.atk = round(f.atk * (1 + 0.10*tier))
    f.max_hp = round(f.max_hp * (1 + 0.05*tier)); f.hp = f.max_hp
    f.mag = round(f.mag * (1 + 0.10*tier))

MON_BASE = {
    "Blando":    dict(hp=40, atk=8,  deff=2,  spd=100, exp=5,  gil=4,  tag="baseline"),
    "Caffiend":  dict(hp=32, atk=10, deff=2,  spd=180, exp=6,  gil=5,  tag="fast"),
    "Safeguard": dict(hp=75, atk=9,  deff=12, spd=70,  exp=12, gil=10, tag="armor"),
    "Kindlebale":dict(hp=55, atk=8,  deff=3,  spd=90,  exp=9,  gil=7,  tag="fireweak"),
    "Shortfuse": dict(hp=45, atk=6,  deff=3,  spd=90,  exp=8,  gil=7,  tag="bomb"),
    "Funkus":    dict(hp=60, atk=7,  deff=4,  spd=85,  exp=10, gil=8,  tag="poison"),
    "Pilferret": dict(hp=38, atk=6,  deff=3,  spd=150, exp=7,  gil=6,  tag="drain"),
}
GATE_BASE = {
    "Blandzilla":   dict(hp=130, atk=11, deff=4,  spd=90, exp=40, gil=35, tag="baseline"),
    "Fort Knoxious":dict(hp=160, atk=12, deff=14, spd=70, exp=70, gil=60, tag="armor"),
    "Vaultron":     dict(hp=240, atk=14, deff=16, spd=70, exp=140,gil=120,tag="boss"),
}

def make_monster(name, zone_index, size=1.0):
    base = MON_BASE.get(name) or GATE_BASE[name]
    scale = G**(zone_index-1)
    f = Fighter(name,
        hp=round(base["hp"]*scale*size), mp=0,
        atk=round(base["atk"]*scale), mag=0,
        deff=round(base["deff"]*scale),
        spd=round(base["spd"]), side="enemy", kind="mon")
    f.tag = base["tag"]
    f.exp = round(base["exp"]*scale)
    f.gil = round(base["gil"]*scale)
    return f

SPECIAL_MP = {"Claude":8, "Barrel":6, "Tofa":7, "Arris":10}
# Ab welcher Zone die Waffen-Spezial jeder Figur verfuegbar ist (Waffenkauf).
SPECIAL_FROM = {"Claude":3, "Barrel":10, "Tofa":19, "Arris":19}

def deal(attacker, target, raw_atk, shock_add=0, label="Angriff"):
    ignore = target.shock_timer > 0
    dmg = phys_dmg(raw_atk, target.deff, ignore_def=ignore)
    if target.shock_timer > 0:
        dmg = round(dmg * SHOCK_DMG_MULT)
    target.hp -= dmg
    if target.tag == "bomb":
        target.hits_taken = getattr(target,"hits_taken",0) + 1
    if target.shock_timer <= 0:
        target.shock += dmg * 0.5 + shock_add
        if target.shock >= SHOCK_THRESHOLD:
            target.shock_timer = SHOCK_WINDOW; target.shock = 0
    if attacker.side == "party":
        attacker.limit = min(100, attacker.limit + dmg * 0.35)
    return dmg

def pick_target(targets):
    bombs = [t for t in targets if t.tag=="bomb"]
    if bombs: return min(bombs, key=lambda e:e.hp)
    drains = [t for t in targets if t.tag=="drain"]
    if drains: return min(drains, key=lambda e:e.hp)
    return min(targets, key=lambda e: e.hp)

def choose_and_act(actor, party, enemies):
    targets = [e for e in enemies if e.alive]
    if not targets: return
    can_sp = getattr(actor, "can_special", True)
    if not can_sp:
        tgt = pick_target(targets)
        deal(actor, tgt, actor.atk, label="Angriff")
        actor.mp = min(actor.max_mp, actor.mp + 2); return
    if actor.name == "Arris":
        hurt = [p for p in party if p.alive and p.hp < 0.45*p.max_hp]
        if hurt and actor.mp >= SPECIAL_MP["Arris"]:
            actor.mp -= SPECIAL_MP["Arris"]; heal = round(actor.mag*2.2)
            for p in party:
                if p.alive: p.hp = min(p.max_hp, p.hp+heal)
            actor.limit = min(100, actor.limit+4); return
    if actor.name == "Tofa":
        tgt = pick_target(targets)
        if actor.mp >= SPECIAL_MP["Tofa"] and tgt.shock_timer<=0 and tgt.shock<SHOCK_THRESHOLD:
            actor.mp -= SPECIAL_MP["Tofa"]
            deal(actor, tgt, actor.atk, shock_add=45, label="Shock-Schlag"); return
    if actor.name == "Barrel":
        fast = [e for e in targets if e.spd >= 140]
        if fast and actor.mp >= SPECIAL_MP["Barrel"]:
            actor.mp -= SPECIAL_MP["Barrel"]; fast[0].suppress=4.0
            deal(actor, fast[0], round(actor.atk*0.8), label="Suppress"); return
    if actor.name == "Claude":
        tgt = max(targets, key=lambda e: e.hp)
        if actor.mp >= SPECIAL_MP["Claude"]:
            actor.mp -= SPECIAL_MP["Claude"]
            deal(actor, tgt, round(actor.atk*3.0), label="Special"); return
    tgt = pick_target(targets)
    deal(actor, tgt, actor.atk, label="Angriff")
    actor.mp = min(actor.max_mp, actor.mp + 2)

def aoe_party(party, dmg):
    for p in party:
        if p.alive:
            p.hp -= dmg
            p.limit = min(100, p.limit + dmg*0.4)

def enemy_act(actor, party):
    alive = [p for p in party if p.alive]
    if not alive: return
    # Shortfuse: nach 3 erlittenen Treffern -> Selbstzerstoerung (AoE), stirbt
    if actor.tag == "bomb" and getattr(actor,"hits_taken",0) >= 3:
        aoe_party(party, round(actor.atk*2.0)); actor.hp = 0; return
    # Boss: jede 3. Aktion telegrafierte Gross-Attacke auf ganze Party
    if actor.tag == "boss":
        actor.actions_done += 1
        if actor.shock_timer <= 0 and actor.actions_done % 3 == 0:
            aoe_party(party, round(actor.atk*1.8)); return
    tgt = min(alive, key=lambda p: p.hp)
    dmg = phys_dmg(actor.atk, tgt.deff)
    tgt.hp -= dmg
    tgt.limit = min(100, tgt.limit + dmg*0.5)
    if actor.tag == "poison":
        tgt.poison_ticks = 4; tgt.poison_dmg = 4
    if actor.tag == "drain":
        victim = max(alive, key=lambda p: p.mp)
        victim.mp -= min(15, victim.mp)
        actor.actions_done += 1
        if actor.actions_done >= 4: actor.fled = True

def simulate_battle(party, enemies, use_limit_on_gate=False, max_t=600):
    for f in party+enemies: f.atb = 0.0
    t = 0.0; poison_acc = 0.0; post_mp={}
    while t < max_t:
        if not any(e.alive for e in enemies): return dict(win=True, time=t)
        if not any(p.alive for p in party):   return dict(win=False, time=t)
        poison_acc += DT
        if poison_acc >= 1.0:
            poison_acc -= 1.0
            for p in party:
                if p.alive and p.poison_ticks>0:
                    p.hp -= p.poison_dmg; p.poison_ticks -= 1
        for f in party+enemies:
            if not f.alive: continue
            f.atb += DT / f.atb_full_time()
            if f.suppress>0: f.suppress -= DT
            if f.side=="enemy" and f.shock_timer>0: f.shock_timer -= DT
            if f.atb >= 1.0:
                f.atb = 0.0
                if f.side=="party":
                    if use_limit_on_gate and f.limit>=100:
                        alive_e=[e for e in enemies if e.alive]
                        if alive_e:
                            strongest=max(alive_e, key=lambda e:e.hp)
                            d=phys_dmg(round(f.atk*4.5), strongest.deff, ignore_def=True)
                            strongest.hp-=d; f.limit=0; continue
                    choose_and_act(f, party, enemies)
                else:
                    enemy_act(f, party)
        t += DT
    return dict(win=False, time=t, timeout=True)

def zone_encounters():
    Z = {}
    Z[1]=[("Blando",1.0)]; Z[2]=[("Blando",1.0)]
    Z[3]=[("Blando",1.0),("Blando",1.15)]; Z[4]=[("Blando",1.0),("Blando",1.15)]
    Z[5]=[("Blando",1.0),("Blando",1.0)]
    Z[6]=[("Blando",1.15),("Blando",1.0),("Blando",0.9)]
    Z[7]=[("Blando",1.15),("Blando",1.0),("Blando",1.0)]
    Z[8]=[("Blandzilla",1.0)]
    Z[9]=[("Blando",1.0),("Caffiend",1.0)]; Z[10]=[("Blando",1.0),("Caffiend",1.0)]
    Z[11]=[("Safeguard",1.0)]
    Z[12]=[("Kindlebale",1.0),("Blando",1.0)]; Z[13]=[("Kindlebale",1.0),("Blando",1.0)]
    Z[14]=[("Caffiend",1.0),("Caffiend",1.0),("Blando",1.0)]
    Z[15]=[("Caffiend",1.0),("Caffiend",1.0),("Blando",1.0)]
    Z[16]=[("Safeguard",1.0),("Caffiend",1.0)]; Z[17]=[("Safeguard",1.0),("Caffiend",1.0)]
    Z[18]=[("Fort Knoxious",1.0),("Caffiend",1.0)]
    Z[19]=[("Funkus",1.0),("Blando",1.0)]; Z[20]=[("Funkus",1.0),("Blando",1.0)]
    Z[21]=[("Shortfuse",1.0),("Blando",1.0),("Blando",1.0)]
    Z[22]=[("Shortfuse",1.0),("Blando",1.0),("Blando",1.0)]
    Z[23]=[("Pilferret",1.0),("Caffiend",1.0)]; Z[24]=[("Pilferret",1.0),("Caffiend",1.0)]
    Z[25]=[("Safeguard",1.0),("Funkus",1.0)]; Z[26]=[("Safeguard",1.0),("Funkus",1.0)]
    Z[27]=[("Shortfuse",1.0),("Shortfuse",1.0)]
    Z[28]=[("Funkus",1.0),("Caffiend",1.0),("Blando",1.0)]
    Z[29]=[("Shortfuse",1.0),("Shortfuse",1.0),("Blando",1.0)]
    Z[30]=[("Vaultron",1.0),("Blando",1.0),("Blando",1.0)]
    return Z

def party_for_zone(z, levels):
    roster = ["Claude"]
    if z>=9: roster.append("Barrel")
    if z>=19: roster += ["Tofa","Arris"]
    party=[]
    for nm in roster:
        c = make_char(nm, levels[nm])
        tier = min(4, levels[nm]//4)
        apply_weapon(c, tier)
        c.can_special = z >= SPECIAL_FROM[nm]
        party.append(c)
    return party

EXP_BASE = 20
EXP_GROWTH = 1.22
def exp_to_next(level):
    return round(EXP_BASE * EXP_GROWTH**(level-1))

RETRY_PENALTY = 5.0  # s Zeitstrafe bei Niederlage

def award(levels, exp_pool, names, eg):
    for nm in names:
        exp_pool[nm]+=eg
        while exp_pool[nm]>=exp_to_next(levels[nm]):
            exp_pool[nm]-=exp_to_next(levels[nm]); levels[nm]+=1

def run_realistic(verbose=True):
    """Realistischer Durchlauf: bei Niederlage grindet die Party die letzte
    geschaffte Zone (deterministisch -> Level muss steigen), bis die aktuelle
    Zone faellt. Misst Gesamt-Kampfzeit inkl. Grind + Zeitstrafen."""
    Z = zone_encounters()
    levels = {"Claude":1,"Barrel":1,"Tofa":1,"Arris":1}
    exp_pool = {"Claude":0,"Barrel":0,"Tofa":0,"Arris":0}
    gil=0.0; total=0.0; region_time={1:0.0,2:0.0,3:0.0}
    grind_battles=0; last_clear=None
    rows=[]
    for z in range(1,31):
        region = 1 if z<=8 else (2 if z<=18 else 3)
        retries=0; grind_here=0
        while True:
            party = party_for_zone(z, levels)
            enemies=[make_monster(nm,z,s) for nm,s in Z[z]]
            is_gate=any(e.name in GATE_BASE for e in enemies)
            res=simulate_battle(party, enemies, use_limit_on_gate=is_gate)
            total+=res["time"]; region_time[region]+=res["time"]
            if res["win"]:
                eg=sum(make_monster(nm,z,s).exp for nm,s in Z[z])
                gg=sum(make_monster(nm,z,s).gil for nm,s in Z[z])
                award(levels, exp_pool, [p.name for p in party], eg)
                gil+=gg; last_clear=z
                break
            # Niederlage -> Zeitstrafe + Grind an letzter geschaffter Zone
            total+=RETRY_PENALTY; region_time[region]+=RETRY_PENALTY; retries+=1
            gz = last_clear if last_clear else z
            gparty=party_for_zone(gz, levels)
            genem=[make_monster(nm,gz,s) for nm,s in Z[gz]]
            gres=simulate_battle(gparty, genem, use_limit_on_gate=any(e.name in GATE_BASE for e in genem))
            total+=gres["time"]; region_time[region]+=gres["time"]
            if gres["win"]:
                eg=sum(make_monster(nm,gz,s).exp for nm,s in Z[gz])
                gg=sum(make_monster(nm,gz,s).gil for nm,s in Z[gz])
                award(levels, exp_pool, [p.name for p in gparty], eg); gil+=gg
            grind_battles+=1; grind_here+=1
            if grind_here>400:
                print(f"!!! Zone {z} nicht schaffbar (Balance-Problem)"); break
        rows.append(dict(zone=z, gate=is_gate, retries=retries, grind=grind_here,
                         clvl=levels["Claude"], cum_min=round(total/60,1)))
        if verbose:
            g=" [GATE]" if is_gate else ""
            print(f"Z{z:>2}{g:7} ClvL={levels['Claude']:>2} retries={retries:>2} grind={grind_here:>3} kum={total/60:5.1f}min")
    if verbose:
        print(f"\nRegion 1: {region_time[1]/60:.1f} min | Region 2: {region_time[2]/60:.1f} min | Region 3: {region_time[3]/60:.1f} min")
        print(f"Gesamt Kapitel 1 (realistisch inkl. Grind): {total/60:.1f} min Kampfzeit")
        print(f"Grind-Kaempfe gesamt: {grind_battles}")
        print(f"Endlevel: {levels}   Gil: {round(gil)}")
    gate_ret = {r["zone"]:r["retries"] for r in rows if r["gate"]}
    return dict(rows=rows, total_min=total/60, grind=grind_battles,
                levels=dict(levels), gate_ret=gate_ret,
                region_min={k:v/60 for k,v in region_time.items()})

def run_chapter(verbose=True):
    Z = zone_encounters()
    levels = {"Claude":1,"Barrel":1,"Tofa":1,"Arris":1}
    exp_pool = {"Claude":0,"Barrel":0,"Tofa":0,"Arris":0}
    gil = 0; total_time = 0.0; rows = []
    region_time = {1:0.0,2:0.0,3:0.0}
    for z in range(1,31):
        region = 1 if z<=8 else (2 if z<=18 else 3)
        party = party_for_zone(z, levels)
        enemies = [make_monster(nm, z, size) for nm,size in Z[z]]
        is_gate = any(e.name in GATE_BASE for e in enemies)
        res = simulate_battle(party, enemies, use_limit_on_gate=is_gate)
        eg = sum(make_monster(nm,z,size).exp for nm,size in Z[z])
        gg = sum(make_monster(nm,z,size).gil for nm,size in Z[z])
        for nm in [p.name for p in party]:
            exp_pool[nm]+= eg
            while exp_pool[nm] >= exp_to_next(levels[nm]):
                exp_pool[nm]-=exp_to_next(levels[nm]); levels[nm]+=1
        gil += gg; total_time += res["time"]; region_time[region]+=res["time"]
        rows.append(dict(zone=z, gate=is_gate, win=res["win"], time=round(res["time"],1),
                     clvl=levels["Claude"], cum=round(total_time,1), n=len(enemies)))
        if verbose:
            gate=" [GATE]" if is_gate else ""
            print(f"Z{z:>2}{gate:7} {'OK' if res['win'] else 'LOSS':4} kampf={res['time']:5.1f}s  ClvL={levels['Claude']:>2} kum={total_time/60:5.1f}min  n={len(enemies)}")
    print(f"\nRegion 1: {region_time[1]/60:.1f} min | Region 2: {region_time[2]/60:.1f} min | Region 3: {region_time[3]/60:.1f} min")
    print(f"Gesamt Kapitel 1 (1 sauberer Durchlauf, reine Kampfzeit): {total_time/60:.1f} min")
    print(f"Endlevel: {levels}   Gil gesammelt: {gil}")
    return rows

if __name__ == "__main__":
    print("="*70); print("A) PERFEKTER DURCHLAUF (obere Schranke, kein Grind)"); print("="*70)
    run_chapter()
    print("\n"+"="*70); print("B) REALISTISCHER DURCHLAUF (mit Grind-Retries)"); print("="*70)
    run_realistic()
