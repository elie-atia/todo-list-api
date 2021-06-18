import React, { Component } from 'react'
import uuid from 'uuid'
import TodoInput from './TodoInput'
import TodoList from './TodoList'
import firebase from 'firebase/app';

const db = firebase.firestore();
// db.settings({ timestampsInSnapshots: true });

class Todo extends React.Component {
	constructor(props) {
		super(props)
		this.state={
			items: [],
			itemsToShow: "all",
			id: uuid(),
			item: '',
			editItem: false,
		}
	}

	handleChange = event => {
		this.setState({
			item: event.target.value
		})
	}

	handleSubmit = event => {  //quand je click sur add new task
		event.preventDefault()
		db.collection('Tasks').add({
			id: this.state.id,
			title: this.state.item,
			completed: false
		});
		const newItem = {
			id: this.state.id,
			title: this.state.item,
			completed: false
		}
		
		const updatedItems = [...this.state.items, newItem]

		if (this.state.item.length > 0) {
			this.setState({
				items: updatedItems,
				id: uuid(),
				item: '',
				editItem: false
			})
		}
	}

	updateTodosToShow = string => {
		alert("update to show");
		this.setState({
			itemsToShow: string
		});
	};

	handleDoneTask = (id, completed) => {
		alert("handle done task");
		const filteredItems = this.state.items.map(item => {
			item.id === id && (item.completed = !item.completed)
			return item
		})

		this.setState({
			items: filteredItems,
		})
	}

	handleDelete = id => {
        alert("handle Delte");
		const filteredItems = this.state.items.filter(item => item.id !== id)

		this.setState({
			items: filteredItems
		})
	}

	handleEdit = id => {
        alert("handle edit");
		const filteredItems = this.state.items.filter(item => item.id !== id)

		const selectedItem = this.state.items.find(item => item.id === id)

		this.setState({
			items: filteredItems,
			id: id,
			item: selectedItem.title,
			editItem: true
		})
	}

	handleDeleteDoneTasks = () => {
        alert("delete done task");
		const filteredItems = this.state.items.filter(item => item.completed === false)

		this.setState({
			items: filteredItems
		})
	}

	clearList = () => {
        alert("clear list");

		this.setState({
			items: []
		})
		db.collection('Tasks').doc(this.state.id).delete();
	}

	render() {
		let items = []
		if (this.state.itemsToShow === "all") {
			items = this.state.items;
		} else if (this.state.itemsToShow === "todo") { //when i click on taches en cours.
			items = this.state.items.filter(item => !item.completed);
		} else if (this.state.itemsToShow === "done") {
			items = this.state.items.filter(item => item.completed);			
		}
		return (
			
			<div className="container">
				<div className="row">
					<div className="col-10 col-md-8 mx-auto mt-4">
						<h3 className="text-capitalize text-center">TodoInput</h3>
						<TodoInput
							item={this.state.item}
							handleChange={this.handleChange}
							handleSubmit={this.handleSubmit}
						/>
						<TodoList
							items={items}
							filterDoneTasks={this.filterDoneTasks}
							clearList={this.clearList}
							handleDelete={this.handleDelete}
							handleEdit={this.handleEdit}
							handleDoneTask={this.handleDoneTask}
							handleDeleteDoneTasks={this.handleDeleteDoneTasks}
							updateTodosToShow={this.updateTodosToShow}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Todo;
