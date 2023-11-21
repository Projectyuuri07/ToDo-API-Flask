document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://10.109.142.49:5000';
    const tabela = document.querySelector(".tabela-js");
    let idAtual = null; // Adicione esta linha para armazenar o ID atual


    // Obtenha tarefas da API e preencha a tabela ao carregar a página
    axios.get(`${apiUrl}/list`)
        .then(function (resposta) {
            getData(resposta.data);
        })
        .catch(function (error) {
            console.error(error);
        });

    // Função para popular a tabela com tarefas
    function getData(dados) {
        tabela.innerHTML = dados.map(item => `
            <tr>
                <th scope="row">${item.ID}</th>
                <td>${item.TAREFA}</td>
                <td>
                    <button class="btn btn-danger delete-btn"><i class="bi bi-trash"></i></button>
                    <button type="button" class="btn btn-primary edit-btn" data-bs-toggle="modal" data-bs-target="#editModal" data-bs-whatever="@mdo"><i class="bi bi-pen"></i></button>
                </td>
            </tr>`
        ).join('');

        addEventListeners();
        };

    function addEventListeners() {
      // Adicione uma nova tarefa
      document.querySelector("#add-tarefa").addEventListener("click", function () {
          const tarefa = document.querySelector("#tarefa").value;
          if (tarefa === "") {
              alert("Digite uma tarefa!");
              return;
          }

          axios.post(`${apiUrl}/add`, { Tarefa: tarefa })
              .then(function () {
                  CarregarTarefas();
              })
              .catch(function (error) {
                  console.error(error);
              });
        });
        
    // Exclua uma tarefa
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            const id = e.target.parentElement.parentElement.firstElementChild.textContent;
            axios.delete(`${apiUrl}/delete/${id}`)
                .then(function () {
                    CarregarTarefas();
                })
                .catch(function (error) {
                    console.error(error);
                });
        });
    });

    // Defina o ID e a tarefa quando o botão de edição é clicado
    document.querySelector(".tabela-js").addEventListener("click", function (e) {
        const editBtn = e.target.closest(".edit-btn");
        if (editBtn) {
            const row = editBtn.closest("tr");
            idAtual = row.querySelector("th").textContent;
            const tarefa = row.querySelector("td").textContent;
            document.querySelector("#edit-tarefa").value = tarefa;
        }
    });

    // Atualize uma tarefa
    document.querySelector("#edit-tarefa-btn").addEventListener("click", function () {
        const tarefaupdate = document.querySelector("#edit-tarefa").value;
        
        if (idAtual) {
            axios.put(`${apiUrl}/update/${idAtual}`, { Tarefa: tarefaupdate })
                .then(function () {
                    CarregarTarefas();
                })
                .catch(function (error) {
                    console.error(error);
                })
                .finally(function () {
                    idAtual = null;
                });
        }
    });
  }

// Função para recarregar as tarefas
function CarregarTarefas() {
    axios.get(`${apiUrl}/listar`)
        .then(function (resposta) {
            getData(resposta.data);
        })
        .catch(function (error) {
            console.error(error);
        });
      }
  });