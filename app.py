from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import csv

app = Flask(__name__)
CORS(app)

try:
    open('Text.csv', 'x')
    with open("Text.csv", "w") as arquivo:
         arquivo.write("ID,TAREFA\n") 
except:
    pass

@app.route("/")
def homepage():
  return 'API Online'

@app.route("/list", methods=['GET'])
def listarTarefas():    
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records')    
    return jsonify(tarefas)

@app.route("/add", methods=['POST'])
def addTarefas():
    item = request.json  
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records') 
    id = len(tarefas) + 1
    with open("Text.csv", "a") as arquivo:
         arquivo.write(f"{id},{item['Tarefa']}\n")    

    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records')        
    return jsonify(tarefas)

@app.route("/update/<int:id>", methods=['PUT'])
def updateTarefas(id):
    item = request.json  
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records') 
    with open("Text.csv", "w") as arquivo:
        arquivo.write("ID,TAREFA\n") 
        for tarefa in tarefas:
            if tarefa['ID'] != id:
                arquivo.write(f"{tarefa['ID']},{tarefa['TAREFA']}\n") 
            else:
                arquivo.write(f"{id},{item['Tarefa']}\n") 
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records')        
    return jsonify(tarefas)

@app.route("/delete/<int:id>", methods=['DELETE'])
def deleteTarefas(id):
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas[tarefas['ID'] != id].reset_index(drop=True)
    tarefas['ID'] = range(1, len(tarefas) + 1)
    tarefas.to_csv('Text.csv', index=False)
    return jsonify(tarefas.to_dict('records'))


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")