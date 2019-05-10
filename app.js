

const dataExample=[{value:5},{value:1} ,{value:0}, {value:2}, {value:4}, {value:6}];
let currentData=[];
let currentList =[];

function getStructure(data){
    var OutList={data:{id:data[0].value}, children:[]};    
    for(var i=1;i<data.length;i++){
        AddChild(OutList,data[i]);
    }
    RemovingNull(OutList);
    return OutList;
}
function AddChild(CurrentLink, NewChild){
    if(CurrentLink.data.id<NewChild.value){
        if(CurrentLink.children[1]==undefined){
            CurrentLink.children[1]={data:{id:NewChild.value}, children:[]};
        }else{
            AddChild(CurrentLink.children[1], NewChild);
        }
    }else{
        if(CurrentLink.children[0]==undefined){
            CurrentLink.children[0]={data:{id:NewChild.value}, children:[]};
        }else{
            AddChild(CurrentLink.children[0], NewChild);
        }
    }    
}

function RemovingNull(Current){
    if (Current.children.length!=0){
        Current.children=Current.children.filter(d=> d!=undefined);
        for(i of Current.children){
            RemovingNull(i)
        }
    }
}

function AddNewNode(NewNode){
    currentData.push(NewNode);
    currentList=getStructure(currentData);
    RemovingNull(currentList);
}

var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const canvas = d3.select("#canvas");

const svg = canvas.append("svg");
svg.attr("width",  width + margin.right + margin.left);
svg.attr("height", height + margin.top + margin.bottom);

const treeLayout = d3.tree().size([width*0.9, height*0.9]);

const zoomG = svg
    .attr('width', width)
    .attr('height', height)
    .append('g');

let g = zoomG.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

//svg.call(d3.zoom().on('zoom', () => {
//    zoomG.attr('transform', d3.event.transform);
//}));

function PintarArbol(Lista){
    const root = d3.hierarchy(Lista);
    const links = treeLayout(root).links();
    const linkPathGenerator = d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y);


    g.selectAll('path').data(links)
        .enter().append('path')
        .attr('d', linkPathGenerator);

    g.selectAll('circulos').data(root.descendants())
        .enter().append("circle")
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr("r",10)
        .style("fill","#fff");

    g.selectAll('text').data(root.descendants())
        .enter().append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('dy', '0.32em')
        .attr('text-anchor', d => 'middle')
        .attr('font-size', d => 1 + 'em')
        .text(d => { return d.data.data.id});

    /*g.data(root.descendants())
        .enter()
        .transition()
        .duration(750)
        .attr("transform", function(d) {
              return "translate(" + d.x +5  + "," + d.y+5  + ")";
        });*/
}

function pintarExample(){
    g.remove();
    g=zoomG.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
        currentData=dataExample.slice(0);;
    currentList =getStructure(currentData);
    PintarArbol(currentList);
}
function cargarJson() {
    var x = document.forms["myForm"]["fdirjson"].value;
    d3.json(x).then(fromJ=>{
        g.remove();
        g=zoomG.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        currentData=fromJ;
        currentList =getStructure(fromJ);
        PintarArbol(currentList); 
    });
  }

function aniadirNodo() {
    var x = document.forms["addForm"]["fnewvalue"].value;
    console.log(x);
    g.remove();
    g=zoomG.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    AddNewNode({value:x})
    PintarArbol(currentList); 
    
  }
//Ubicacion de acuerdo a la posicios del nodo d.children ? 'middle': 'start'
//Tamaño dela fuente de acuerdo a la profundidad del nodo .attr('font-size', d => 3.25 - d.depth + 'em')
//AddNewNode({data:{id:66},children:[]});