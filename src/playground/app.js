class IndecisionApp extends React.Component{
    constructor(props) {
        super(props);
        this.handleDeleteOptions = this.handleDeleteOptions.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);
        this.handlePick = this.handlePick.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
        this.state = {
            options: [] 
        };
    }
    componentDidMount() {                                                       //NATIVE "LIFECYCLE" METHOD THAT TRIGGERS WHEN THE APP IS MOUNTED
        try {
            console.log('componentDidMount!');
            const json = localStorage.getItem('options');                           //Retrieve the options from local storage as JSON 
            const options = JSON.parse(json);                                       //convert JSON back to javascript
            if (options) {
                this.setState(() => ({options}) );                                      //Update options array based on local storage
            }
        } catch (e) {
            //Do nothing at all
        }
        
    }
    componentDidUpdate(prevProps, prevState) {                                  //NATIVE "LIFECYCLE" METHOD THAT TRIGGERS WHENEVER PAGE IS UPDATED
        if (prevState.options.length !== this.state.options.length) {
            const json = JSON.stringify(this.state.options);                    
            localStorage.setItem('options', json);                              //Save the options array into local storage (must be in JSON format)                      
            console.log('saving data');
        }
    }
    componentWillUnmount() {                                                    //NATIVE "LIFECYCLE" METHOD THAT TRIGGERS WHEN NAVIGATING AWAY FROM PAGE
        console.log('componentWillUnmount!');
    }
    handleDeleteOptions() {
        this.setState(() => ({ options: [] }));
    }
    handleDeleteOption(optionToRemove) {
        this.setState((prevState) => ({
            options: prevState.options.filter((option) => optionToRemove !== option )
        }));
    }
    handlePick() {
        const randomNum = Math.floor(Math.random() * this.state.options.length);
        const option = this.state.options[randomNum];
        alert(option);                             
    }
    handleAddOption(option) {
        if (!option) {
            return 'Enter valid value to add item';
        } else if (this.state.options.indexOf(option) > -1) {
            return 'This option already exists';
        }
        
        // this.setState((prevState) => {
        //     return {
        //         options: prevState.options.concat(option)
        //     };
        // });
        //BELOW IS SHORTHAND VERSION OF ABOVE
        this.setState((prevState) => ({options: prevState.options.concat(option)}));
        
    }
    render() {
        const subtitle = 'Put your life in the hands of a computer';
        
        return (
            <div>
                <Header subtitle={subtitle}/>
                <Action 
                    hasOptions={this.state.options.length > 0}
                    handlePick={this.handlePick}
                />
                <Options 
                    options={this.state.options}
                    handleDeleteOptions={this.handleDeleteOptions}
                    handleDeleteOption={this.handleDeleteOption}
                />
                <AddOption 
                    handleAddOption={this.handleAddOption}
                />
            </div>
        );
    }
}

const Header = (props) => {
    return (
        <div>
            <h1>{props.title}</h1>
            {props.subtitle && <h2>{props.subtitle}</h2>}
        </div>
    );
};
//SETTING DEFAULT PROPERTIES FOR A COMPONENT
Header.defaultProps = {
    title: 'Indecision'
};

const Action = (props) => {
    return (
        <div>
            <button 
                disabled={!props.hasOptions} 
                onClick={props.handlePick}
            >
                What should I do?
            </button>
        </div>
    );
};

const Options = (props) => {
    return (
        <div>
            <button onClick={props.handleDeleteOptions}>Remove All</button>
            {props.options.length === 0 && <p>Please add an option to get started!</p>}
            {
                props.options.map((option) => (
                    <Option 
                        key={option} 
                        optionText={option} 
                        handleDeleteOption={props.handleDeleteOption}
                    />
                ))
            }
        </div>
    );
};


const Option = (props) => {
    return (
        <div>
            {props.optionText}
            <button 
                onClick={(e) => {
                    props.handleDeleteOption(props.optionText);
                }}
            >
                Remove
            </button>
        </div>
    );
};

class AddOption extends React.Component{
    constructor(props) {
        super(props);
        this.handleAddOption = this.handleAddOption.bind(this);
        this.state = {
            error: undefined
        };
    }
    handleAddOption(e) {
        e.preventDefault();     //will stop full page refresh
        const option = e.target.elements.option.value.trim();
        const error = this.props.handleAddOption(option);
        
        this.setState(() => ({error}) ); 
        
        if (!error) {
            e.target.elements.option.value = '';
        }
    }
    render() {
        return (
            <div>
                {this.state.error && <p>{this.state.error}</p>}
                <form onSubmit={this.handleAddOption}>
                    <input type="text" name="option" />
                    <button>Add Option</button>
                </form>
            </div>
        );
    }
} 

//STATELESS FUNCTIONAL COMPONENT EXAMPLE

// const User = (props) => {
//     return (
//         <div>
//             <p>Name: {props.name}</p>
//             <p>Age: {props.age}</p>
//         </div>
//     );
// };

ReactDOM.render(<IndecisionApp />, document.getElementById('app'));