function init_debugger(picker, label) {
    dc = {
                  current_step: 0,
                  steps: [],

                  clear(){
                      this.steps = [];
                      this.current_step = 0;
                      picker.disabled=false;
                      picker.value = 0;
                      label.innerText = "...";
                      reset_globals();
                      
                  },
                  add_new_step(label){
                      this.steps.push({
                          label: label,
                          nodes: produce_nodes()
                      });
                      picker.max = this.steps.length;
                  },
                  
                  set_step_to(num){
                      this.current_step = num;
                      this.cy.elements().remove();
                      this.cy.add(this.steps[num].nodes);
                      label.innerText = this.steps[num].label;
                      this.cy.layout({ name: 'dagre'}).run();
                  },
                  
                  step_forward(){
                      if (this.current_step < this.steps.length)
                          this.set_step_to(this.current_step + 1);
                  },
                  
                  step_backward(){
                      if (this.current_step > 0)
                          this.set_step_to(this.current_step - 1);
                  },
                  
                  cy : cytoscape({
                      container: document.getElementById('cy'),
                      
                      boxSelectionEnabled: false,
                      autounselectify: true,
                      
                      layout: {
                          name: 'dagre'
                      },
                  
                      style: [
                          {
                              selector: 'node',
                              style: {
                                  'background-color': '#11479e',
                                  'border-style': 'solid',
                                  'border-color': '#454049'
                              }
                          },
                  
                          {
                              "selector": "node[label]",
                              "style": {
                                  "label": "data(label)",
                                  "color": "#fff",
                                  "text-outline-color": "#7CC5A7",
                                  "text-outline-width": 2,
                                  "text-valign": "center",
                                  "text-halign": "center"
                              }
                          },
                          
                          {
                              "selector": "edge[label]",
                              "style": {
                                  "label": "data(label)",
                                  "width": 3,
                                  "color": "#fff",
                                  "text-outline-color": "#7CC5A7",
                                  "text-outline-width": 2,
                                  "text-valign": "center",
                                  "text-halign": "center"
                              }
                          },
                  
                          {
                              "selector": '.variable',
                              "style": {
                                  'border-style': 'solid',
                                  'border-width' : '1',
                                  'background-color': '#A0D3B0'
                              }
                          },

                  
                          {
                              "selector": '.atom',
                              "style": {
                                  'border-style': 'solid',
                                  'border-width' : '1',
                                  'background-color': '#F2E89E'
                              }
                          },
                  
                          {
                              "selector": '.structured',
                              "style": {
                                  'border-style': 'solid',
                                  'border-width' : '1',
                                  'background-color': '#C6B476'
                              }
                          },

                          {
                              selector: '.copy',
                              "style" :{
                                  'border-width' : '2',
                                  'border-color': '#5EAAEF'
                              }
                              
                          },

                          {
                              selector: '.model',
                              style :{
                                  'border-width' : '2',
                                  'border-color': '#CE80A8'
                              }
                              
                          },
                          
                          {
                              selector: 'edge',
                              style: {
                                  'width': 4,
                                  'target-arrow-shape': 'triangle',
                                  'line-color': '#454049',
                                  'target-arrow-color': '#454049',
                                  'curve-style': 'bezier'
                              }
                          },

                          {
                              "selector": '.backup',
                              "style": {
                                  'width': 2,
                                  'line-color': '#CE80A8',
                                  'line-style': 'dashed',
                                  'target-arrow-color': '#CE80A8'
                              }
                          },

                          
                      ],
                      elements: produce_nodes()
                  
                  }),
                  
              };
}
