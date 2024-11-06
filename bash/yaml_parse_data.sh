#!/bin/bash

# return map keys or array indices
# return array indicess
yq e '.config.repositories | keys' sample.yml
# return map keys
yq e '.config.metatags | keys' sample.yml

# filter arrays and maps by a boolean expression
# select elements from array
yq e '.[] | select(. == "*ur*")' days.yml

# select items from map
yd e '.[] | select(. == "der Montag" or test("der\sM.+")' days_en-de.yml
# use with_entries to filter map keys
yd e 'with_entries(select(.key | test(M.+)))' days_en-de.yml
# select multiple elements in a map and update
yq e '.[] | select(test("der\sM.+")) |= "---"' days_en-de.yml

# delete matching entries in maps or arrays
# delete entry from map
yq e 'del(.Monday)' days_en-de.yml
# delete nested entry in map
yq e 'del(.days.Monday)' calendar_en-de.yml

#delete entry in array
yq e 'del(.[1])' days.yml
#delete matching entries
yq e 'del(.[] | select(test("S.*"))' days.yml
# recursively delete matching keys
yq e 'del(.. | select(has("days")).days)' calendar.yml
