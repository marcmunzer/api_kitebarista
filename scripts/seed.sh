#!/usr/bin/env bash
# Usage: ./scripts/seed.sh [base_url]
# Default base_url: http://localhost:3000

set -e

BASE_URL="${1:-http://localhost:3000}"
API="$BASE_URL/api"

command -v curl >/dev/null 2>&1 || { echo "curl is required but not installed."; exit 1; }
command -v jq   >/dev/null 2>&1 || { echo "jq is required but not installed. Run: apt install jq"; exit 1; }

post() {
  local endpoint="$1"
  local body="$2"
  local response
  response=$(curl -sf -X POST "$API/$endpoint" \
    -H "Content-Type: application/json" \
    -d "$body")
  echo "$response"
}

echo "Seeding $BASE_URL ..."
echo ""

# ── Locations ─────────────────────────────────────────────────────────────────
echo "Creating locations..."
LOC_CABEDELO=$(post locations '{"name":"Cabedelo de Viana","country":"Portugal","waves":true,"flatWater":false}')
ID_CABEDELO=$(echo "$LOC_CABEDELO" | jq -r '.id')
post locations '{"name":"Tarifa","country":"Spain","waves":true,"flatWater":false}' > /dev/null
post locations '{"name":"Fuerteventura","country":"Spain","waves":true,"flatWater":false}' > /dev/null
post locations '{"name":"Dakhla","country":"Morocco","waves":false,"flatWater":true}' > /dev/null
post locations '{"name":"Essaouira","country":"Morocco","waves":true,"flatWater":false}' > /dev/null
post locations '{"name":"El Gouna","country":"Egypt","waves":false,"flatWater":true}' > /dev/null
post locations '{"name":"Cabarete","country":"Dominican Republic","waves":true,"flatWater":false}' > /dev/null
post locations '{"name":"Cumbuco","country":"Brazil","waves":false,"flatWater":true}' > /dev/null
post locations '{"name":"Mui Ne","country":"Vietnam","waves":false,"flatWater":false}' > /dev/null
post locations '{"name":"Boa Vista","country":"Cape Verde","waves":true,"flatWater":false}' > /dev/null
post locations '{"name":"Lake Garda","country":"Italy","waves":false,"flatWater":true}' > /dev/null
post locations '{"name":"Hood River","country":"USA","waves":false,"flatWater":true}' > /dev/null
echo "  Created 12 locations (Cabedelo de Viana id=$ID_CABEDELO)"

# ── Brands ────────────────────────────────────────────────────────────────────
echo "Creating brands..."
CABRINHA=$(post brands '{"name":"Cabrinha","webpage":"https://www.cabrinha.com"}')
DUOTONE=$(post brands '{"name":"Duotone","webpage":"https://www.duotonesports.com"}')
NORTH=$(post brands '{"name":"North","webpage":"https://www.northkb.com"}')
SLINGSHOT=$(post brands '{"name":"Slingshot","webpage":"https://www.slingshotsports.com"}')
CORE=$(post brands '{"name":"Core","webpage":"https://www.corekites.com"}')

ID_CABRINHA=$(echo "$CABRINHA"   | jq -r '.id')
ID_DUOTONE=$(echo "$DUOTONE"     | jq -r '.id')
ID_NORTH=$(echo "$NORTH"         | jq -r '.id')
ID_SLINGSHOT=$(echo "$SLINGSHOT" | jq -r '.id')
ID_CORE=$(echo "$CORE"           | jq -r '.id')

echo "  Cabrinha=$ID_CABRINHA  Duotone=$ID_DUOTONE  North=$ID_NORTH  Slingshot=$ID_SLINGSHOT  Core=$ID_CORE"

# ── Kite models ───────────────────────────────────────────────────────────────
echo "Creating kite models..."
K1=$(post kites  "{\"brand_id\":$ID_CABRINHA,  \"name\":\"Moto\",       \"year\":2024, \"size\":12.0}")
K2=$(post kites  "{\"brand_id\":$ID_CABRINHA,  \"name\":\"Switchblade\", \"year\":2023, \"size\":9.0}")
K3=$(post kites  "{\"brand_id\":$ID_CABRINHA,  \"name\":\"Drifter\",     \"year\":2024, \"size\":7.0}")
K4=$(post kites  "{\"brand_id\":$ID_DUOTONE,   \"name\":\"Evo\",         \"year\":2024, \"size\":10.0}")
K5=$(post kites  "{\"brand_id\":$ID_DUOTONE,   \"name\":\"Vegas\",       \"year\":2023, \"size\":12.0}")
K6=$(post kites  "{\"brand_id\":$ID_DUOTONE,   \"name\":\"Neo\",         \"year\":2024, \"size\":8.0}")
K7=$(post kites  "{\"brand_id\":$ID_NORTH,     \"name\":\"Reach\",       \"year\":2024, \"size\":11.0}")
K8=$(post kites  "{\"brand_id\":$ID_NORTH,     \"name\":\"Carve\",       \"year\":2023, \"size\":9.0}")
K9=$(post kites  "{\"brand_id\":$ID_SLINGSHOT, \"name\":\"RPM\",         \"year\":2024, \"size\":12.0}")
K10=$(post kites "{\"brand_id\":$ID_SLINGSHOT, \"name\":\"Rally\",       \"year\":2023, \"size\":10.0}")
K11=$(post kites "{\"brand_id\":$ID_CORE,      \"name\":\"XR\",          \"year\":2024, \"size\":13.0}")
K12=$(post kites "{\"brand_id\":$ID_CORE,      \"name\":\"Section\",     \"year\":2023, \"size\":9.0}")

ID_K1=$(echo "$K1"   | jq -r '.id')
ID_K2=$(echo "$K2"   | jq -r '.id')
ID_K3=$(echo "$K3"   | jq -r '.id')
ID_K4=$(echo "$K4"   | jq -r '.id')
ID_K5=$(echo "$K5"   | jq -r '.id')
ID_K6=$(echo "$K6"   | jq -r '.id')
ID_K7=$(echo "$K7"   | jq -r '.id')
ID_K8=$(echo "$K8"   | jq -r '.id')
ID_K9=$(echo "$K9"   | jq -r '.id')
ID_K10=$(echo "$K10" | jq -r '.id')
ID_K11=$(echo "$K11" | jq -r '.id')
ID_K12=$(echo "$K12" | jq -r '.id')

echo "  Created kite models: $ID_K1 $ID_K2 $ID_K3 $ID_K4 $ID_K5 $ID_K6 $ID_K7 $ID_K8 $ID_K9 $ID_K10 $ID_K11 $ID_K12"

# ── Users ─────────────────────────────────────────────────────────────────────
echo "Creating users..."
U1=$(post users '{"name":"Marc Munzer",    "email":"marc@kitebarista.com",    "skill_level":4}')
U2=$(post users '{"name":"Sarah Jones",    "email":"sarah@kitebarista.com",   "skill_level":3}')
U3=$(post users '{"name":"Tom Weber",      "email":"tom@kitebarista.com",     "skill_level":5}')
U4=$(post users '{"name":"Anna Schmidt",   "email":"anna@kitebarista.com",    "skill_level":2}')
U5=$(post users '{"name":"Luis Garcia",    "email":"luis@kitebarista.com",    "skill_level":4}')

ID_U1=$(echo "$U1" | jq -r '.id')
ID_U2=$(echo "$U2" | jq -r '.id')
ID_U3=$(echo "$U3" | jq -r '.id')
ID_U4=$(echo "$U4" | jq -r '.id')
ID_U5=$(echo "$U5" | jq -r '.id')

echo "  Users: $ID_U1 $ID_U2 $ID_U3 $ID_U4 $ID_U5"

# ── Owned kites ───────────────────────────────────────────────────────────────
echo "Creating owned kites..."
O1=$(post owned-kites  "{\"user_id\":$ID_U1, \"brand_id\":$ID_CABRINHA,  \"kite_id\":$ID_K1,  \"purchased_date\":\"2024-01-10\"}")
O2=$(post owned-kites  "{\"user_id\":$ID_U1, \"brand_id\":$ID_CABRINHA,  \"kite_id\":$ID_K2,  \"purchased_date\":\"2022-05-20\", \"sold_date\":\"2023-11-01\"}")
O3=$(post owned-kites  "{\"user_id\":$ID_U2, \"brand_id\":$ID_DUOTONE,   \"kite_id\":$ID_K4,  \"purchased_date\":\"2023-03-15\"}")
O4=$(post owned-kites  "{\"user_id\":$ID_U2, \"brand_id\":$ID_DUOTONE,   \"kite_id\":$ID_K6,  \"purchased_date\":\"2024-02-28\"}")
O5=$(post owned-kites  "{\"user_id\":$ID_U3, \"brand_id\":$ID_NORTH,     \"kite_id\":$ID_K7,  \"purchased_date\":\"2023-07-01\"}")
O6=$(post owned-kites  "{\"user_id\":$ID_U3, \"brand_id\":$ID_CORE,      \"kite_id\":$ID_K11, \"purchased_date\":\"2024-03-10\"}")
O7=$(post owned-kites  "{\"user_id\":$ID_U4, \"brand_id\":$ID_SLINGSHOT, \"kite_id\":$ID_K10, \"purchased_date\":\"2023-09-05\"}")
O8=$(post owned-kites  "{\"user_id\":$ID_U5, \"brand_id\":$ID_CABRINHA,  \"kite_id\":$ID_K3,  \"purchased_date\":\"2024-04-01\"}")
O9=$(post owned-kites  "{\"user_id\":$ID_U5, \"brand_id\":$ID_NORTH,     \"kite_id\":$ID_K8,  \"purchased_date\":\"2023-06-15\"}")

ID_O1=$(echo "$O1" | jq -r '.id')
ID_O2=$(echo "$O2" | jq -r '.id')
ID_O3=$(echo "$O3" | jq -r '.id')
ID_O4=$(echo "$O4" | jq -r '.id')
ID_O5=$(echo "$O5" | jq -r '.id')
ID_O6=$(echo "$O6" | jq -r '.id')
ID_O7=$(echo "$O7" | jq -r '.id')
ID_O8=$(echo "$O8" | jq -r '.id')
ID_O9=$(echo "$O9" | jq -r '.id')

echo "  Owned kites: $ID_O1 $ID_O2 $ID_O3 $ID_O4 $ID_O5 $ID_O6 $ID_O7 $ID_O8 $ID_O9"

# ── Sessions ──────────────────────────────────────────────────────────────────
echo "Creating sessions..."
post sessions "{\"date\":\"2024-05-01\", \"start_time\":\"09:00\", \"end_time\":\"12:30\", \"power\":2,  \"user_id\":$ID_U1, \"owned_kite_id\":$ID_O1}" > /dev/null
post sessions "{\"date\":\"2024-05-08\", \"start_time\":\"10:00\", \"end_time\":\"13:00\", \"power\":1,  \"user_id\":$ID_U1, \"owned_kite_id\":$ID_O1}" > /dev/null
post sessions "{\"date\":\"2024-05-15\", \"start_time\":\"08:30\", \"end_time\":\"11:00\", \"power\":-1, \"user_id\":$ID_U1, \"owned_kite_id\":$ID_O1}" > /dev/null
post sessions "{\"date\":\"2024-04-20\", \"start_time\":\"11:00\", \"end_time\":\"14:00\", \"power\":2,  \"user_id\":$ID_U2, \"owned_kite_id\":$ID_O3}" > /dev/null
post sessions "{\"date\":\"2024-04-27\", \"start_time\":\"09:30\", \"end_time\":\"12:00\", \"power\":0,  \"user_id\":$ID_U2, \"owned_kite_id\":$ID_O4}" > /dev/null
post sessions "{\"date\":\"2024-05-03\", \"start_time\":\"07:00\", \"end_time\":\"11:30\", \"power\":2,  \"user_id\":$ID_U3, \"owned_kite_id\":$ID_O5}" > /dev/null
post sessions "{\"date\":\"2024-05-10\", \"start_time\":\"08:00\", \"end_time\":\"13:00\", \"power\":1,  \"user_id\":$ID_U3, \"owned_kite_id\":$ID_O6}" > /dev/null
post sessions "{\"date\":\"2024-05-17\", \"start_time\":\"09:00\", \"end_time\":\"12:00\", \"power\":-2, \"user_id\":$ID_U3, \"owned_kite_id\":$ID_O5}" > /dev/null
post sessions "{\"date\":\"2024-03-15\", \"start_time\":\"10:00\", \"end_time\":\"12:30\", \"power\":0,  \"user_id\":$ID_U4, \"owned_kite_id\":$ID_O7}" > /dev/null
post sessions "{\"date\":\"2024-03-22\", \"start_time\":\"11:00\", \"end_time\":\"13:00\", \"power\":1,  \"user_id\":$ID_U4, \"owned_kite_id\":$ID_O7}" > /dev/null
post sessions "{\"date\":\"2024-05-05\", \"start_time\":\"08:00\", \"end_time\":\"11:00\", \"power\":2,  \"user_id\":$ID_U5, \"owned_kite_id\":$ID_O8}" > /dev/null
post sessions "{\"date\":\"2024-05-12\", \"start_time\":\"09:00\", \"end_time\":\"12:30\", \"power\":-1, \"user_id\":$ID_U5, \"owned_kite_id\":$ID_O9}" > /dev/null

echo "  Created 12 sessions"

# ── Forecasts & Measurements — Cabedelo de Viana (3 days, hourly) ─────────────
# Typical June nortada (NNW): builds through the morning, peaks mid-afternoon.
# Wind speed in knots, wave height derived from wind, semi-diurnal Atlantic tide.

# 24-hour wind speed pattern (knots)
WS=(8 7 7 7 8 10 13 16 18 21 23 24 25 24 23 21 19 17 15 13 11 9 8 8)
# Wind direction (°, NNW)
WD=(348 347 346 345 346 348 350 352 352 350 347 344 341 341 343 346 349 351 352 351 349 348 348 348)
# Wave direction (°, NW Atlantic swell)
WAVED=(322 321 320 320 321 322 323 324 324 323 321 318 316 316 318 320 323 324 324 323 322 321 321 322)
# Air temperature (°C)
TEMP=(17 17 17 17 17 18 18 19 20 21 22 22 22 22 21 21 20 20 19 18 18 18 17 17)

DATES=("2026-06-18" "2026-06-19" "2026-06-20")

echo "Creating forecasts for Cabedelo de Viana..."
for d in 0 1 2; do
  date="${DATES[$d]}"
  for h in $(seq 0 23); do
    total_h=$((d * 24 + h))
    hpad=$(printf '%02d' $h)
    ws=${WS[$h]}
    wd=${WD[$h]}
    waved=${WAVED[$h]}
    tmp=${TEMP[$h]}
    wave_h=$(awk "BEGIN {printf \"%.2f\", 0.35 + ${ws} * 0.055}")
    tide=$(awk "BEGIN {printf \"%.2f\", 2.00 + 1.20 * cos(2 * 3.14159265 * ${total_h} / 12.42)}")
    post forecasts "{\"time\":\"${date}T${hpad}:00:00\",\"location_id\":${ID_CABEDELO},\"windSpeed\":${ws},\"windDirection\":${wd},\"waveHeight\":${wave_h},\"waveDirection\":${waved},\"tide\":${tide},\"temperature\":${tmp}}" > /dev/null
  done
  echo "  Forecasts done: ${date}"
done

# Wind offsets per day for measurements (actual observations deviate from forecast)
M_WS_OFFSET=(1 2 -1)
M_WH_OFFSET=("0.05" "0.12" "-0.06")
M_TIDE_OFFSET=("0.03" "-0.02" "0.05")

echo "Creating measurements for Cabedelo de Viana..."
for d in 0 1 2; do
  date="${DATES[$d]}"
  ws_off=${M_WS_OFFSET[$d]}
  wh_off=${M_WH_OFFSET[$d]}
  tide_off=${M_TIDE_OFFSET[$d]}
  for h in $(seq 0 23); do
    total_h=$((d * 24 + h))
    hpad=$(printf '%02d' $h)
    ws=$((${WS[$h]} + ws_off))
    wd=${WD[$h]}
    waved=${WAVED[$h]}
    tmp=${TEMP[$h]}
    wave_h=$(awk "BEGIN {printf \"%.2f\", 0.35 + ${WS[$h]} * 0.055 + ${wh_off}}")
    tide=$(awk "BEGIN {printf \"%.2f\", 2.00 + 1.20 * cos(2 * 3.14159265 * ${total_h} / 12.42) + ${tide_off}}")
    post measurements "{\"time\":\"${date}T${hpad}:00:00\",\"location_id\":${ID_CABEDELO},\"windSpeed\":${ws},\"windDirection\":${wd},\"waveHeight\":${wave_h},\"waveDirection\":${waved},\"tide\":${tide},\"temperature\":${tmp}}" > /dev/null
  done
  echo "  Measurements done: ${date}"
done

echo ""
echo "Done! Seeded:"
echo "  12 locations, 5 brands, 12 kite models, 5 users, 9 owned kites, 12 sessions"
echo "  72 forecasts + 72 measurements for Cabedelo de Viana (18–20 Jun 2026, hourly)"
