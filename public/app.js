const { Component, createElement } = React;

class App extends Component {
    constructor () {
        super ()
        this.state = {
            items : []
        }
    }
    getallitems () {
        fetch('/list')
            .then(response => response.json())
            .then(data => {
                this.setState({items: data.sort((a, b) => a.position - b.position)})
                console.log(data)
            });
    }
    componentDidMount() {
        this.getallitems();
    }
    render () {
        return createElement('div', {},
            createElement(AddItemForm, {getallitems : () => this.getallitems()}),
            createElement(List, {items : this.state.items, getallitems : () => this.getallitems()})
        )
    }
}

class AddItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {value : ""}
    }
    addItem (e) {
        fetch('/list/add', {
            method:"put",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({'text': this.state.value})
        })
        .then(() => {
            this.props.getallitems()
            this.setState({value: ""});
            this.refs.input.value = "";
        })
        e.preventDefault()
    }
    render () {
        return createElement('form', {onSubmit : (e) => this.addItem(e)},
            createElement('input',{ref: "input", onChange: (e) => this.setState({value: e.target.value}), placeholder: "What do you want to do ?"}),
            createElement('button', {className: "add-button", title: "Add item"})
        )
    }
}

class ListItem extends Component {
    editItem () {
        let newText = prompt("Edit ToDo", this.props.text);
        if (newText) {
            fetch('/list/edit', {
                method:"post",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({'position': this.props.position,'text': newText})
            })
            .then(() => this.props.getallitems())
        }
    }
    deleteItem () {
        fetch('/list/delete', {
            method:"delete", 
            headers:{'Content-Type': 'application/json'}, 
            body:JSON.stringify({position: this.props.position})
        })
        .then(() => this.props.getallitems())
    }
    render () {
        return createElement('li', {},
            createElement('span', {}, this.props.text),
            createElement('button', {onClick : () => this.editItem(), className: "edit-button", title: "Edit item"}),
            createElement('button', {onClick : () => this.deleteItem(), className: "delete-button", title: "Delete item"})
        )
    }
}

class List extends Component {
    render () {
        let listItems = []
        for(let i=0; i < this.props.items.length; i++) {
            listItems.push(createElement(ListItem, {text : this.props.items[i].text, position : this.props.items[i].position, getallitems : () => this.props.getallitems()}));
        }
        return createElement('ul', {}, ...listItems)
    }
}

ReactDOM.render(createElement(App), document.getElementById('app'));