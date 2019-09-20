import React from 'react';
const baseUrl = "localhost"

class List extends React.Component {

    state = {
        story: []
    }

    componentDidMount() {
        this.getNews().then(data => 
            this.setState({story: data})
        )
    }

    getNews = () => {
        fetch(baseUrl)
        .then(function(response) {
            return response.json();
        })
        .catch(function(error) {
            return error;
        });
    }

    render() {
        return(
            <li>List</li>
        )
    }
}

export default List;