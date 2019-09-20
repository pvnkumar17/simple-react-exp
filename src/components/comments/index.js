import React from 'react';
import List from '../list';
const baseUrl = "localhost";

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
            <div>
                <ul>
                    {this.state.story && this.state.story.map((item, index) => <List />)}
                </ul>
            </div>
        )
    }
}

export default Comments;