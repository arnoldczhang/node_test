import * as React from 'react';
class MyClass extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  clickHandler() {
    alert(111);
  }

  render() {
    return (<h1 onClick={this.clickHandler}>hello {this.props.name}</h1>);  
  }
}

export default function (name) {
  return (<MyClass name={name}/>);
};