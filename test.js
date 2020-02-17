$(document).ready(function() {
    
    $.getScript("/script/jsnetworkx.js", function() {
        //alert("Script loaded but not necessarily executed.");
    });
    
    $.ajax({
        type: "GET",
        url: "result.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
    
    
});

function processData(allText) {
    var G = new jsnx.DiGraph();
    var All_Machine = []
    var allTextLines = allText.split(/\r\n|\n/);
    console.log(allTextLines.length);
    var i;
    var entries ,SampleID,ParentID ,Start_Machine,End_Machine ,Duration;
    for (i = 0; i < allTextLines.length;i++){
        entries = allTextLines[i].split(',');
        SampleID = entries[0];
        ParentID = entries[1];
        Start_Machine = entries[3];
        End_Machine = entries[4];
        Duration = entries[5];
        
        if ( !All_Machine.includes(Start_Machine)){
            All_Machine.push(Start_Machine);
        }
        
        if  ( !All_Machine.includes(End_Machine)){
            All_Machine.push(End_Machine);
        }
        
        //console.log(allTextLines[i]);
    }
    console.log(All_Machine);
    All_Machine.forEach(function (item, index) {
        G.addNode(index, {name: item});
    });
    
    console.log(G.nodes(true));
    
    var Start_Machine_Index, End_Machine_Index;
    for (i = 0; i < allTextLines.length;i++){
        entries = allTextLines[i].split(',');
        SampleID = entries[0];
        ParentID = entries[1];
        Start_Machine = entries[3];
        End_Machine = entries[4];
        Duration = entries[5];
        Start_Machine_Index = All_Machine.indexOf(Start_Machine)
        End_Machine_Index =  All_Machine.indexOf(End_Machine)
        var Start_Index,End_Index
        var found_edge = false;
        G.edges().forEach(function (item, index) {
            Start_Index = item[0];
            End_Index = item[1];
            //console.log('Start_Index=' + Start_Index );
            //console.log('End_Index=' + End_Index );
            if (Start_Index == Start_Machine_Index && End_Index == End_Machine_Index){
                found_edge = true;
                G.adj.get(Start_Machine_Index).get(End_Machine_Index).SampleCount =  G.adj.get(Start_Machine_Index).get(End_Machine_Index).SampleCount + 1;
            }
        });
        
        if (!found_edge){
            G.addEdge(Start_Machine_Index,End_Machine_Index);
            G.adj.get(Start_Machine_Index).get(End_Machine_Index).SampleCount = 1
        }
    }
    console.log(G.edges(true));
    var edges_to_remove = [];
    var edge_to_remove = [];
    G.edges().forEach(function (item, index) {
        Start_Index = item[0];
        End_Index = item[1];
        var SampleCount = G.adj.get(Start_Index).get(End_Index).SampleCount;
        
        if(SampleCount < 20){
            console.log('lol');
            console.log(SampleCount);
            edge_to_remove = [Start_Index,End_Index];
            edges_to_remove.push(edge_to_remove);
        }
    });
    console.log(edges_to_remove);
    G.removeEdgesFrom(edges_to_remove)
    jsnx.draw(G, {
        element: '#demo-canvas',
        width : 800,
        height : 800,
        withLabels: true,
        labels : 'name',
        weighted : true,
        weights : 'SampleCount'
    });
    
}

/**
sigma.parsers.json('data.json', {
            container: 'graph-container',
            settings: {
              defaultNodeColor: '#ec5148'
            }
          });
**/