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


script_dir = os.path.dirname(__file__)
rel_path = "../datasets/intermediate/world-happiness-cleaned-default.json"
abs_file_path = os.path.join(script_dir, rel_path)

with open(abs_file_path) as f:
    data = json.load(f)

rel_path = "../datasets/world-happiness.json"
abs_file_path = os.path.join(script_dir, rel_path)

with open(abs_file_path, 'x') as outfile:
    json.dump(dict(by_year(data)), outfile)
