import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, Image } from 'react-native';
import t from 'tcomb-form-native';

 

// Create shorted distance variablkes
const shortestDistance = (edges,source,target) => {
// Create a constant set consisting of previous, distance and adjacent variables
    const Q = new Set(),
          prev = {},
          dist = {},
          adj = {}
 
// set minimum distance to infinity 
    const vertex_with_min_dist = (Q,dist) => {
        let min_distance = Infinity,
            u = null
 
// Set minimum distance to distance 
        for (let v of Q) {
            if (dist[v] < min_distance) {
                min_distance = dist[v]
                u = v
            }
        }
// return value
        return u
    }
 
// check edge length
    for (let i=0;i<edges.length;i++) {
        let v1 = edges[i][0], 
            v2 = edges[i][1],
            len = edges[i][2]
 
        Q.add(v1)
        Q.add(v2)
 
        dist[v1] = Infinity
        dist[v2] = Infinity
 
        if (adj[v1] === undefined) adj[v1] = {}
        if (adj[v2] === undefined) adj[v2] = {}
 
        adj[v1][v2] = len
        adj[v2][v1] = len
    }
 
    dist[source] = 0
 
    while (Q.size) {
        let u = vertex_with_min_dist(Q,dist),
            neighbors = Object.keys(adj[u]).filter(v=>Q.has(v)) //Neighbor still in Q 
 
        Q.delete(u)
 
        if (u===target) break //Break when the target has been found
 
        for (let v of neighbors) {
            let alt = dist[u] + adj[u][v]
            if (alt < dist[v]) {
                dist[v] = alt
                prev[v] = u
            }
        }
    }
 
    {
        let u = target,
        S = [u],
        len = 0
 
        while (prev[u] !== undefined) {
            S.unshift(prev[u])
            len += adj[u][prev[u]]
            u = prev[u]
        }
        return [S,len]
    }   
}


 
//plot nodes to graph
let graph = []
graph.push(["A", "C", 2])
graph.push(["C", "D", 1])
graph.push(["C", "F", 4])
graph.push(["B", "D", 4])
graph.push(["B", "E", 7])
graph.push(["D", "F", 1])
graph.push(["D", "G", 2])
graph.push(["F", "G", 3])
graph.push(["G", "H", 4])
graph.push(["F", "H", 10])



// Creat Form
const Form = t.form.Form;

// Create Form Structure
const User = t.struct({
  FROM: t.String,
  TO: t.String,
});

// Form Styling
const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
    },
  },
  controlLabel: {
    normal: {
      color: 'blue',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    },
    // the style applied when a validation error occours
    error: {
      color: 'red',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    }
  }
}

// Create form options and error messages
const options = {
  fields: {
    FROM: {
      error: 'This needs a value?'
    },
    TO: {
      error: 'This needs a value?'
    },
  },
  stylesheet: formStyles,
};



export default class App extends Component {

constructor(){
 
    super();
    
    this.state={
 
      // This is our Default Text.
      pathText : 'ROUTE: ',
      lengthText : 'DISTANCE: ',
 
    }
  }
    // Button click handler
  handleSubmit = () => {
      // Create value variable that takes the form values
    var value = this._form.getValue();
      // Specify source and target values 
      from =  value.FROM;
      to =   value.TO;
      // Find path and length from graph, from and to variables 
      let [path,length] = shortestDistance(graph, from, to);
      // log the path and length
      console.log("Route " + path, "Distance: " + length) //[ 'a', 'c', 'f', 'e' ]
console.log(length) //20
      // Set new text state 
       this.setState({
      // Set state to include new path and length variables
       pathText:'ROUTE: ' +  path,
      lengthText: 'DISTANCE: ' + length,
    
})

  }
  
  // Create front-end 
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>SHORTEST DISTANCE TEST</Text>
        <Image style={styles.image} source={require('./assets/distances.png')} />
        <Form 
          ref={c => this._form = c}
          type={User} 
          options={options}
          style={styles.form}
        />
        <Button
          title="SHORTEST DISTANCE"
          onPress={this.handleSubmit}
        />
        <Text style={styles.text}> {this.state.pathText} </Text>
        <Text style={styles.text}> {this.state.lengthText} </Text>
      </View>

    );
  }
}

// Text and container styling
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
    text: {
    justifyContent: 'center',
    padding: 20,
    paddingLeft: 0,
    backgroundColor: '#ffffff',
    color: 'blue',
    fontWeight: 'bold'
  },
        image: {
    width: 350,
    height: 120,
  },
 
});
