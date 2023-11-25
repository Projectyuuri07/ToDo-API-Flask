document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://api.azevedoyuuri.repl.co'; //Insira o Url da sua API
    const tabela = document.querySelector(".tabela-js");

    // Obtenha os dados da API e insira-os na tabela
    axios.get(`${apiUrl}/list`)
        .then(function (resposta) {
            getData(resposta.data);
        })
        .catch(function (error) {
            console.error(error);
        });

    // Obtenha os dados da API e insira-os na tabela
    function getData(dados) {
        tabela.innerHTML = dados.map(item => `
            <tr>
                <th scope="row" class="id">${item.ID}</th>
                <td class="tarefa">${item.TAREFA}</td>
                <td>
                    <button class="btn btn-danger delete-btn"><i class="bi bi-trash"></i></button>
                    <button type="button" class="btn btn-primary edit-btn" data-bs-toggle="modal" data-bs-target="#editModal" data-bs-whatever="@mdo"><i class="bi bi-pen"></i></button>
                </td>
            </tr>`
        ).join('');

        addEventListeners();
    };

    // Adicione uma tarefa
    function addEventListeners() {
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
            const id = e.target.closest("tr").querySelector(".id").textContent;
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
              const id = row.querySelector(".id").textContent;
              const tarefa = row.querySelector(".tarefa").textContent;
              document.querySelector("#edit-tarefa").value = tarefa;

    document.querySelector("#edit-tarefa-btn").addEventListener("click", function () {
      const novaTarefa = document.querySelector("#edit-tarefa").value;
      editarTarefa(id, novaTarefa);
    });
          }});

    // Editar uma tarefa
    function editarTarefa(id, novaTarefa) {
        axios.put(`${apiUrl}/update/${id}`, { Tarefa: novaTarefa })
            .then(function () {
                 CarregarTarefas();
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    // Função para recarregar as tarefas
    function CarregarTarefas() {
        axios.get(`${apiUrl}/list`)
            .then(function (resposta) {
                getData(resposta.data);
            })
            .catch(function (error) {
                console.error(error);
            });
          }
    }
});
