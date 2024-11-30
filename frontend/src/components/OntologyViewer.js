import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OntologyViewer = () => {
  const [projectName, setProjectName] = useState('');
  const [ontology, setOntology] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/project-info/')
      .then(response => {
        setProjectName(response.data.project_name);
        setOntology(response.data.ontology);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>{projectName}</h1>
      {ontology ? (
        <div>
          <h2>Ontology:</h2>
          <ul>
            {ontology.nodes.map(node => (
              <li key={node.id}>{node.label}</li>
            ))}
          </ul>
          <p>Edges:</p>
          <ul>
            {ontology.edges.map((edge, index) => (
              <li key={index}>
                {edge.source} - {edge.relation} - {edge.target}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading ontology...</p>
      )}
    </div>
  );
};

export default OntologyViewer;
