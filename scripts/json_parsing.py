from itertools import groupby
import itertools
import json
import os


def by_year(data):
    from itertools import groupby
    from operator import itemgetter

    retain_keys = ("Country", "Region", "Happiness Rank", "Happiness Score",
                   "Economy (GDP per Capita)", "Freedom to make life choices", "Healthy life expectancy", "Generosity", "Trust (Government Corruption)")

    for year, group in groupby(data, key=itemgetter("Year")):
        as_tpl = tuple(group)
        yield str(year), dict(zip(map(itemgetter("ISO"), as_tpl), [{k: d[k] for k in retain_keys} for d in as_tpl]))


def by_id(data):
    from itertools import groupby
    from operator import itemgetter

    retain_keys = ("Country", "Region", "Population",
                   "Area (sq. mi.)", "Pop. Density (per sq. mi.)", "Coastline (coast/area ratio)", "Net migration", "Infant mortality (per 1000 births)", "GDP ($ per capita)", "Literacy (%)", "Phones (per 1000)", "Arable (%)", "Crops (%)", "Other (%)", "Climate", "Birthrate", "Deathrate", "Agriculture", "Industry", "Service")

    new_dict = {}
    for item in data:
        ID = item.pop('id')
        new_dict[ID] = item

    return new_dict


def clean_world_happiness():
    script_dir = os.path.dirname(__file__)
    rel_path = "../datasets/intermediate/world-happiness-cleaned-default.json"
    abs_file_path = os.path.join(script_dir, rel_path)

    with open(abs_file_path) as f:
        data = json.load(f)

    rel_path = "../datasets/world-happiness.json"
    abs_file_path = os.path.join(script_dir, rel_path)

    with open(abs_file_path, 'x') as outfile:
        json.dump(dict(by_year(data)), outfile)


def clean_countries_of_the_world():
    script_dir = os.path.dirname(__file__)
    rel_path = "../datasets/intermediate/countries_of_the_world.json"
    abs_file_path = os.path.join(script_dir, rel_path)

    with open(abs_file_path) as f:
        data = json.load(f)

    rel_path = "../datasets/countries-of-the-world.json"
    abs_file_path = os.path.join(script_dir, rel_path)

    with open(abs_file_path, 'x') as outfile:
        json.dump(dict(by_id(data)), outfile)


if __name__ == "__main__":
    clean_countries_of_the_world()
