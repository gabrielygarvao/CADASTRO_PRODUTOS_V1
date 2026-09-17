// ==================================================
// FASE 1: MODELAGEM DOS DADOS (Classe Base)
// ==================================================
// A classe funciona como um "molde" ou "planta baixa" para criar produtos.
class Produto {
    #preco
    #quantidade
    constructor(nome, preco, quantidade) {
        if (nome == "") {
            throw new Error("O nome não pode estar em branco!")
        }

        if (preco <= 0) {
            throw new Error("O preço deve ser maior que zero!")
        }

        if (quantidade <= 0) {
            throw new Error("A quantidade deve ser maior que zero!")
        }

        this.nome = nome;
        this.#preco = parseFloat(preco); // Converte o texto do input para número decimal
        this.#quantidade = parseInt(quantidade); // Converte o texto do input para número inteiro
    }

    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    // Método que calcula o subtotal deste produto específico
    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}

// ==================================================
// FASE 2: GERENCIAMENTO DE ESTADO (Memória)
// ==================================================
// Array global que guardará todas as instâncias da classe Produto const listaDeProdutos = [];
const listaDeProdutos = [];

// ==================================================
// FASE 3: ESCUTA DE EVENTOS DO DOM
// ==================================================
// Selecionamos o formulário do HTML pelo ID
const formProduto = document.getElementById("produto-form");

// Adicionamos um escutador de eventos para quando o formulário for enviado (submit)
formProduto.addEventListener("submit", function (event) {

    // Impede que a página recarregue ao enviar o formulário
    event.preventDefault();

    // 1. Captura os valores digitados nos campos de input do HTML
    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    try {
        const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);
        listaDeProdutos.push(novoProduto);

        // 4. Atualiza e exibe a tabela e o total, depois limpa o formulário
        renderizarTabela();
        atualizarTotalEstoque();
        formProduto.reset();

    } catch (erro) {
        alert(erro.message);
    }

});

// ==================================================
// FASE 3: RENDERIZAÇÃO DA INTERFACE (DOM)
// ==================================================
// Função responsável por desenhar na tela o estado atual do Array listaDeProdutos
function renderizarTabela() {
    // Seleciona o corpo da tabela (tbody)
    const tabelaBody = document.querySelector("#tabela-produtos tbody");

    // Limpa o conteúdo anterior da tabela para evitar duplicações
    tabelaBody.innerHTML = "";

    // Percorre o Array de produtos usando forEach
    listaDeProdutos.forEach((produto, index) => {
        // Cria um elemento <tr> (linha da tabela)
        const linha = document.createElement("tr");

        // Preenche o conteúdo interno da linha com os dados do objeto
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                <button class="btn-remover" onclick="removerProduto(${index})">Remover</button>
            </td>
        `;

        // Insere a linha criada dentro do tbody
        tabelaBody.appendChild(linha);
    });
}

function atualizarTotalEstoque() {
    // O reduce percorre o array e soma o subtotal de cada produto
    const total = listaDeProdutos.reduce((soma, produto) => {
        return soma + produto.calcularSubtotal();
    }, 0);
    const elementoTotal = document.getElementById("total-estoque");
    elementoTotal.textContent = `Total em estoque: R$ ${total.toFixed(2).replace(".", ",")}`;
}


function removerProduto(index) {
    listaDeProdutos.splice(index, 1);

    // Atualiza a tabela depois da remoção
    renderizarTabela();

    // Atualiza o total do estoque depois da remoção
    atualizarTotalEstoque();
}

const botaoLimpar = document.getElementById("limpar-tabela");

// Adiciona um evento de clique no botão
botaoLimpar.addEventListener("click", function () {

    // Esvazia completamente o array de produtos
    listaDeProdutos.length = 0;
    renderizarTabela();

    // Atualiza o total
    atualizarTotalEstoque();
});
