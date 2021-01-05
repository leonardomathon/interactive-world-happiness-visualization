# basic modules
import pandas as pd
import numpy as np
import json
import glob
import os

# Get absolute path
script_location = os.path.abspath('')

# Get data set file paths
data_2015 = os.path.join(script_location, '../datasets/original/2015.csv')
data_2016 = os.path.join(script_location, '../datasets/original/2016.csv')
data_2017 = os.path.join(script_location, '../datasets/original/2017.csv')
data_2018 = os.path.join(script_location, '../datasets/original/2018.csv')
data_2019 = os.path.join(script_location, '../datasets/original/2019.csv')
data_2020 = os.path.join(script_location, '../datasets/original/2020.csv')

# Create dataframes, rename the columns
df_2015 = pd.read_csv(data_2015).assign(Year='2015')
df_2015.rename(columns={"Health (Life Expectancy)": "Healthy life expectancy",
                        "Freedom": "Freedom to make life choices"}, inplace=True)

df_2016 = pd.read_csv(data_2016).assign(Year='2016')
df_2016.rename(columns={"Health (Life Expectancy)": "Healthy life expectancy",
                        "Freedom": "Freedom to make life choices"}, inplace=True)

df_2017 = pd.read_csv(data_2017).assign(Year='2017')
df_2017.rename(columns={"Happiness.Score": "Happiness Score", "Happiness.Rank": "Happiness Rank", "Economy..GDP.per.Capita.": "Economy (GDP per Capita)",
                        "Health..Life.Expectancy.": "Healthy life expectancy", "Freedom": "Freedom to make life choices", "Trust..Government.Corruption.": "Trust (Government Corruption)"}, inplace=True)

df_2018 = pd.read_csv(data_2018).assign(Year='2018')
df_2018.rename(columns={"Score": "Happiness Score", "Country or region": "Country", "Overall rank": "Happiness Rank",
                        "GDP per capita": "Economy (GDP per Capita)", "Perceptions of corruption": "Trust (Government Corruption)"}, inplace=True)

df_2019 = pd.read_csv(data_2019).assign(Year='2019')
df_2019.rename(columns={"Score": "Happiness Score", "Country or region": "Country", "Overall rank": "Happiness Rank",
                        "GDP per capita": "Economy (GDP per Capita)", "Perceptions of corruption": "Trust (Government Corruption)"}, inplace=True)

# Healthy life expectancy
df_2020 = pd.read_csv(data_2020).assign(Year='2020')
df_2020.rename(columns={"Ladder score": "Happiness Score", "Country name": "Country", "Explained by: Log GDP per capita": "Economy (GDP per Capita)",
                        "Perceptions of corruption": "Trust (Government Corruption)", "Regional indicator": "Region"}, inplace=True)
df_2020["Happiness Rank"] = np.arange(len(df_2020)) + 1

# Add region to data sets 2017, 2018, 2019
# Set index to country for all dataframes
df_country_region = df_2015[["Country", "Region"]]


df_2015 = df_2015.set_index(["Country", "Year"])
df_2016 = df_2016.set_index(["Country", "Year"])
df_2017 = df_country_region.join(df_2017.set_index("Country"), on="Country").sort_values(
    by=["Happiness Score"], ascending=False).set_index(["Country", "Year"])
df_2018 = df_country_region.join(df_2018.set_index("Country"), on="Country").sort_values(
    by=["Happiness Score"], ascending=False).set_index(["Country", "Year"])
df_2019 = df_country_region.join(df_2019.set_index("Country"), on="Country").sort_values(
    by=["Happiness Score"], ascending=False).set_index(["Country", "Year"])
df_2020 = df_2020.set_index(["Country", "Year"])

# Merge all datasets into a single dataset
matching_columns = ["Region", "Happiness Rank", "Happiness Score"]

data = pd.concat([df_2015[matching_columns], df_2016[matching_columns], df_2017[matching_columns],
                  df_2018[matching_columns], df_2019[matching_columns], df_2020[matching_columns]])

data.to_csv(os.path.join(script_location, '../datasets/cleaned-data.csv'))
