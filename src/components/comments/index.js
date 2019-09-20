import React from 'react';
const baseUrl = "localhost"

class Comments extends React.Component {

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
            <div>Comments Page</div>
        )
    }
}

export default Comments;