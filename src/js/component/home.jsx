import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [lista, setLista] = useState([])
	const [tareas, setTareas] = useState("")


	// const agregar = (evento) => {

	// 	if (evento.key === "Enter") {
	// 		evento.preventDefault()
	// 		// setLista([...lista, tareas])
	// 		// setTareas("")
	// 	}
	// }

	const agregar = async (evento) => {
		if (evento.key === "Enter") {
			evento.preventDefault();
			if (tareas !== "") {
				// setLista([...lista, { label: tareas, done: false }]);
				try {
					const response = await fetch("https://playground.4geeks.com/todo/todos/Cgeorge", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							label: tareas,
							done: false
						})
					})
					if (response.status == 201) {
						await obtenerTareas()
						setTareas("");
						return
					}
				} catch (error) {
					console.log(error)
				}
			}
		}
	};

	const eliminar = async (id) => {
		// console.log(id)
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			})
			// console.log(response)
			if (response.status == 204) {
				await obtenerTareas()
				return
			}
		} catch (error) {
			console.log(error)
		}
	}

	const obtenerTareas = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/Cgeorge")
			if (response.status == 404) {
				//Si no existe el usuario, lo va a crear
				await crearUsuario()
				return
			}
			const data = await response.json()
			// console.log(data.todos)
			setLista(data.todos)
		} catch (error) {
			console.log(error)
		}
	}

	const crearUsuario = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/Cgeorge", {
				method: "POST",
				headers: { "Content-Type": "application/json" }
			})
			if (response.status == 201) {
				await obtenerTareas()
				return
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		obtenerTareas()
	}, [])

	return (
		<div className="container text-center">
			<h1 className="text-center mt-5">TodoList</h1>
			<form className="row g-3 d-flex justify-content-center">
				<div className="">
					<input
						value={tareas}
						onChange={(evento) => setTareas(evento.target.value)}
						onKeyDown={agregar}
						type="text"
						className="form-control border border-secondary"
						placeholder="add a task" />
				</div>
			</form>
			<ul className="list-group border-secondary">
				{
					lista.map((tarea, index) => (
						<li key={index} className="list-group-item border border-secondary">
							{tarea.label}
							<button type="button" class="btn btn-outline-danger float-end hidden-icon" onClick={() => eliminar(tarea.id)}>x</button>
						</li>
					))
				}
			</ul>
			<h4 className="mt-3">tareas pendientes: {lista.length}</h4>
		</div>
	);
};

export default Home;

