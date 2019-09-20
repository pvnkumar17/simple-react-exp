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

    getNews = (id) => {
        fetch(baseUrl+id+".json")
        .then(function(response) {
            return response.json();
        })
        .catch(function(error) {
            return error;
        });
    }

    render() {
        const length = this.state.story.kids && this.state.story.kids.length;
        return(
            <li>
            {this.state.story &&
                <div>
                    <h3></h3>
                </div>
            }
            </li>
        )
    }
}

export default List;