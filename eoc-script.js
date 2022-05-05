const EocScript = {
  store: {
    set(val) {
      localStorage.setItem("eoc-script", JSON.stringify(val));
    },
    get() {
      return JSON.parse(localStorage.getItem("eoc-script"));
    },
  },

  action: {
    openForm() {
      const form = document.querySelector(".popup-formulario");
      form.classList.add("active");
    },

    closeForm() {
      const form = document.querySelector(".popup-formulario");
      form.classList.remove("active");
    },

    addTaskList(task) {
      const rootTarefas = document.getElementById("tarefas");

      let html = `
        <tr id=${task.nome.toLowerCase()}>
        <td>${task.nome}</td>
        <td>${task.status}</td>
        <td><button id="concluir">concluir</button> / <button id="excluir">excluir</button></td>
        </tr>
        `;

      rootTarefas.innerHTML += html;
    },

    newTask(e) {
      e.preventDefault();

      const open = document
        .querySelector(".popup-formulario")
        .classList.contains("active");

      if (!open) {
        EocScript.action.openForm();
      }
    },

    createTask(e) {
      e.preventDefault();

      const nome_tarefa = document.getElementById("tarefa-nome").value;

      if (nome_tarefa) {
        const task = {
          nome: nome_tarefa,
          status: "pendente",
        };

        const tasks = EocScript.store.get();

        const filter = tasks.filter((task) => task.nome === nome_tarefa);

        if (filter.length === 0) {
          tasks.push(task);
          EocScript.store.set(tasks);

          EocScript.action.addTaskList(task);

          EocScript.action.updateAllCounters(EocScript.store.get());
          EocScript.action.updateList(EocScript.store.get());

          EocScript.action.closeForm();
        } else {
          alert("Tarefa já existente");
        }
      } else {
        alert("Preencha o nome da tarefa");
        return;
      }
    },

    cancelTask(e) {
      e.preventDefault();

      EocScript.action.closeForm();
    },

    deleteTask(e) {
      e.preventDefault();

      const task = e.target.parentNode.parentNode.id;

      const tasks = EocScript.store.get();

      const filter = tasks.filter((task) => task.nome !== task);

      filter.splice(filter.indexOf(task), 1);

      EocScript.store.set(filter);

      e.target.parentNode.parentNode.remove();

      EocScript.action.updateAllCounters(EocScript.store.get());
      EocScript.action.updateList(EocScript.store.get());
    },

    setConcluido(e) {
      e.preventDefault();


        const task = e.target.parentNode.parentNode.id; 
        const tasks = EocScript.store.get();

        const filter = tasks.filter((tsk) => tsk.nome === task);

        tasks[tasks.indexOf(filter[0])].status = "concluido";

        EocScript.store.set(tasks);

        e.target.parentNode.parentNode.remove();

        EocScript.action.updateAllCounters(EocScript.store.get());
        EocScript.action.updateList(EocScript.store.get());

        console.log(filter);
    },

    updateTotalCount(tasks) {
      const total = document.getElementById("tarefas-totais");

      total.innerHTML = tasks.length;
    },

    updatePendentCount(tasks) {
      const pendent = document.getElementById("tarefas-pendentes");

      const pendentCount = tasks.filter((task) => task.status === "pendente");
      pendent.innerHTML = pendentCount.length;
    },

    updateConcluidoCount(tasks) {
      const concluido = document.getElementById("tarefas-concluidas");

      const concluidoCount = tasks.filter(
        (task) => task.status === "concluido"
      );
      concluido.innerHTML = concluidoCount.length;
    },

    updateAllCounters(tasks) {
      EocScript.action.updateTotalCount(tasks);
      EocScript.action.updatePendentCount(tasks);
      EocScript.action.updateConcluidoCount(tasks);
    },

    updateList(tasks) {
      const rootTarefas = document.getElementById("tarefas");
      rootTarefas.innerHTML = "";

      tasks.forEach((task) => {
        EocScript.action.addTaskList(task);
      });

      EocScript.action.updateAllCounters(EocScript.store.get());

      document.querySelectorAll("#excluir").forEach((button) => {
        button.addEventListener("click", EocScript.action.deleteTask);
      });

      document.querySelectorAll("#concluir").forEach((button) => {
        button.addEventListener("click", EocScript.action.setConcluido);
      });
    },
  },

  init() {
    document
      .getElementById("nova-tarefa")
      .addEventListener("click", this.action.newTask);

    document
      .getElementById("cancelar-tarefa")
      .addEventListener("click", this.action.cancelTask);

    document
      .getElementById("criar-tarefa")
      .addEventListener("click", this.action.createTask);

    const tasks = EocScript.store.get();

    if (!tasks) {
      EocScript.store.set([]);
    } else {
      const rootTarefas = document.getElementById("tarefas");
      EocScript.action.updateAllCounters(tasks);

      tasks.forEach((task) => {
        let html = `
                <tr id=${task.nome.toLowerCase()}>
                <td>${task.nome}</td>
                <td>${task.status}</td>
                <td><button id="concluir">concluir</button> / <button id="excluir">excluir</button></td>
                </tr>
                `;

        rootTarefas.innerHTML += html;
      });

      document.querySelectorAll("#excluir").forEach((button) => {
        button.addEventListener("click", this.action.deleteTask);
      });

      document.querySelectorAll("#concluir").forEach((button) => {
        button.addEventListener("click", this.action.setConcluido);
      });
    }
  },
};

EocScript.init();
