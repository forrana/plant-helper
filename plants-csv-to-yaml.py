import csv
import yaml

with open('plants.csv') as csvfile:
    plantsreader = csv.reader(csvfile, delimiter=';', quotechar='\"')
    pk = 1
    entries = []
    for row in plantsreader:
        print('| '.join(row))
        nick_names_arr = row[0].split(',')
        nick_names_arr_sanitized = map(str.strip, nick_names_arr)
        nick_names_arr_capitalized = map(str.title, nick_names_arr_sanitized)
        nick_names_list = list(nick_names_arr_capitalized)
        entry = {
            "model": "catalog.plantentry",
            "pk": pk,
            "fields": {
                "nick_name": row[0].strip(),
                "nick_names": nick_names_list,
                "scientific_name": row[1],
                "days_between_watering_growing": row[2] + " 00:00:00",
                "days_between_watering_dormant": row[3] + " 00:00:00"
            }
        }
        entries.append(entry)
        pk += 1
    with open('plants.yaml', 'w+') as yamlfile:
        yamlfile.write(yaml.dump(entries))
    
