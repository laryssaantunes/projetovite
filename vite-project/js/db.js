import { openDB } from 'idb';

let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                if (oldVersion < 1) {
                    const store = db.createObjectStore('pessoas', {
                        keyPath: 'nome' 
                    });
                    store.createIndex('id', 'id');
                    console.log('Banco de dados criado!');
                }
            }
        });
        console.log("Banco de dados aberto.");
    } catch (e) {
        console.log("Erro ao criar o banco de dados: " + e.message);
    }
}

window.addEventListener("DOMContentLoaded", async event => {
    await createDB();
    document.getElementById("btnSalvar").addEventListener("click", addData);
    document.getElementById("btnListar").addEventListener("click", getData);
    document.getElementById("btnAtualizar").addEventListener("click", updateData);
    document.getElementById("btnRemover").addEventListener("click", removeData);
    document.getElementById("btnBuscar").addEventListener("click", searchData); 
});

async function addData() {
    const nome = document.getElementById("inputNome").value;
    const idade = document.getElementById("inputIdade").value;

    if (!nome || !idade) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const tx = await db.transaction('pessoas', 'readwrite');
        const store = tx.objectStore('pessoas');
        const id = Date.now();
        const pessoa = { nome, idade, id };
        await store.add(pessoa); 
        await tx.done;
        showResult("Pessoa salva com sucesso!");
    } catch (e) {
        showResult("Erro ao salvar os dados: " + e.message);
    }
}

async function getData() {
    if (!db) {
        showResult("O banco de dados está fechado.");
        return;
    }

    try {
        const tx = await db.transaction('pessoas', 'readonly');
        const store = tx.objectStore('pessoas');
        const pessoas = await store.getAll();
        await tx.done;

        if (pessoas.length === 0) {
            showResult("Não há dados no banco.");
        } else {
            const result = pessoas.map(pessoa => `${pessoa.nome}, ${pessoa.idade} anos`).join("<br>");
            showResult("Dados do banco:<br>" + result);
        }
    } catch (e) {
        showResult("Erro ao listar os dados: " + e.message);
    }
}

async function updateData() {
    const nome = document.getElementById("inputNome").value;
    const idade = document.getElementById("inputIdade").value;

    if (!nome || !idade) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const tx = await db.transaction('pessoas', 'readwrite');
        const store = tx.objectStore('pessoas');
        
        const pessoaExistente = await store.get(nome); 

        if (pessoaExistente) {
            pessoaExistente.idade = idade;  
            await store.put(pessoaExistente);

            await tx.done;
            showResult(`Dados de ${nome} atualizados com sucesso!`);
        } else {
            showResult(`Pessoa com o nome ${nome} não encontrada.`);
        }
    } catch (e) {
        showResult("Erro ao atualizar os dados: " + e.message);
    }
}

async function removeData() {
    const nome = document.getElementById("inputBuscar").value;

    if (!nome) {
        alert("Por favor, informe o nome para remover.");
        return;
    }

    try {
        const tx = await db.transaction('pessoas', 'readwrite');
        const store = tx.objectStore('pessoas');
        
        const pessoaExistente = await store.get(nome);

        if (pessoaExistente) {
            await store.delete(nome); 
            await tx.done;
            showResult(`Pessoa ${nome} removida com sucesso!`);
        } else {
            showResult(`Pessoa com o nome ${nome} não encontrada.`);
        }
    } catch (e) {
        showResult("Erro ao remover os dados: " + e.message);
    }
}

async function searchData() {
    const nome = document.getElementById("inputBuscar").value; 

    if (!nome) {
        alert("Por favor, informe o nome para buscar.");
        return;
    }

    try {
        const tx = await db.transaction('pessoas', 'readonly');
        const store = tx.objectStore('pessoas');
        
        const pessoa = await store.get(nome); 

        if (pessoa) {
            showResult(`Pessoa encontrada: ${pessoa.nome}, ${pessoa.idade} anos.`);
        } else {
            showResult(`Pessoa com o nome ${nome} não encontrada.`);
        }
    } catch (e) {
        showResult("Erro ao buscar os dados: " + e.message);
    }
}

function showResult(text) {
    document.querySelector("output").innerHTML = text;
}
