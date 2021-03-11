# -*- coding: utf-8 -*-
"""
Created on Mon Mar  8 13:24:27 2021

@author: 1513 X-MXTI
"""

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def hello():
    return 	render_template('index.html')