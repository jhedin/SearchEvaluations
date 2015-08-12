
// creates a grid of a given shape and [rough] size, with the size varying to nicely fit the shape
function generate(size, shape)
{
	switch(shape)
	{
		case "triangle":
			return triangle(size);
			break;
		case "rhombus":
			return rhombus(size);
			break;
		case "line":
			return line(size);
			break;
		case "rectangle":
			return rectangle(size);
			break;
		case "hexagon":
			return hexagon(size);
			break;
	}
}

// creates a rectangle shaped grid
function rectangle(size)
{
	small = 12,
	large = 20;

	if(size == "small")
	{
		for(y = 0; y < 3; y++)
		for(x = 0; x < 4; x++)
		{

		}
	}
	else if(size == "large")
	{
		for(y = 0; y < 5; y++)
		for(x = 0; x < 4; x++)
		{
			
		}
	}
	return {};
}

// creates a triangle shaped grid
function triangle(size)
{
	var locs = {};
	var node_list = [];
	var small = 10;
	var large = 21;

	locs.imax = 0;
	locs.jmax = 0;
	locs.kmax = 0;

	if(size == "small")
	{
		locs.n = small;
		for(total = 0; total < 4; total++)
		for(split = 0; split <= total; split++)
		{
			// (split, total - split) are the axial coordinates
			var loc = [split, total - split, -total];
			node_list.push(loc);
			locs[loc] = {loc: [split, total - split, -total], cost: null};
			locs.imax = Math.max(locs.imax,loc[0]);
			locs.jmax = Math.max(locs.jmax,loc[1]);
			locs.kmax = Math.max(locs.kmax,loc[2]);
		}
	}
	else if(size == "large")
	{
		locs.n = large;
		for(total = 0; total < 6; total++)
		for(split = 0; split <= total; split++)
		{
			// (split, total - split) are the axial coordinates
			var loc = [split, total - split, -total];
			node_list.push(loc);
			locs[loc] = {loc: [split, total - split, -total], cost: null};	
			locs.imax = Math.max(locs.imax,loc[0]);
			locs.jmax = Math.max(locs.jmax,loc[1]);
			locs.kmax = Math.max(locs.kmax,loc[2]);
		}
	}
	locs.nodes = node_list;
	return locs;
}

// creates a line shaped grid
function line(size)
{
	small = 10,
	large = 20;

	if(size == "small")
	{
		for(x = 0; x < 4; x++)
		{

		}
	}
	else if(size == "large")
	{
		for(x = 0; x < 4; x++)
		{
			
		}
	}
}

// creates a rhombus shaped grid
function rhombus(size)
{
	small = 12,
	large = 20;

	if(size == "small")
	{
		for(y = 0; y < 3; y++)
		for(x = 0; x < 4; x++)
		{

		}
	}
	else if(size == "large")
	{
		for(y = 0; y < 5; y++)
		for(x = 0; x < 4; x++)
		{
			
		}
	}
}

// creates a hexagonal shaped grid
function hexagon(size)
{
	small = 10,
	large = 19;

	if(size == "small")
	{
		for(y = 0; y < 3; y++)
		for(x = 0; x < 4; x++)
		{

		}
	}
	else if(size == "large")
	{
		for(y = 0; y < 5; y++)
		for(x = 0; x < 4; x++)
		{
			
		}
	}
}

// sets the inner obstacles and the begin/end locations
function instantiate(obstacles, base)
{
	var instance = {nodes:JSON.parse(JSON.stringify(base))};
	var edges = {};
	edges.n = 0;

	while(edges.n < obstacles && edges.n < 2*(base.n-1))
	{
		// generate a possible break
		var edge = [base.nodes[Math.floor(Math.random() * base.n)]]; 
		edge[1] = neighbor(edge[0], Math.floor(Math.random() * 6));
		var swapped_edge = [edge[1],edge[0]];
		// is it valid? is it new?
		if(base[edge[0]] && base[edge[1]])
		{
			if(edges[edge] || edges[swapped_edge])
				continue;

			// add it!
			edges.n++;
			edges[edge] = 1;
			edges[swapped_edge] = 1;
		}
	}

	instance.edges = edges;
	
	var begin = Math.floor(Math.random() * base.n);
	var end = begin;
	while(end == begin)
		end = Math.floor(Math.random() * base.n);

	instance.begin = base.nodes[begin];
	instance.end = base.nodes[end];

	return instance;
}


function neighbor(current, dir)
{
	var adj = 
		[
			[0,1,-1],[0,-1,1],
			[1,-1,0],[-1,1,0],
			[1,0,-1],[-1,0,1]
		];
	
	return [
			current[0] + adj[dir][0],
			current[1] + adj[dir][1],
			current[2] + adj[dir][2]
		];
}

function solve_problems()
{
	base_large = generate("large", "triangle");
	base_small = generate("small", "triangle");
	var case1 = [];
	var case2 = [];
	var case3 = [];
	var case4 = [];

	// instantiate 100 valid problems of each.
	//case 1
	for( var i = 0; i < 40;)
	{
		case1[i] = instantiate(3,base_small);
		if(BFS(case1[i]).path)
			i++;
	}
	for( var i = 40; i < 100;)
	{
		case1[i] = instantiate(4,base_small);
		if(BFS(case1[i]).path)
			i++;
	}
	// case 2
	for( var i = 0; i < 100;)
	{
		case2[i] = instantiate(9,base_small);
		if(BFS(case2[i]).path)
			i++;
	}
	// case 3
	for( var i = 0; i < 100;)
	{
		case3[i] = instantiate(9,base_large);
		if(BFS(case3[i]).path)
			i++;
	}
	// case 4
	for( var i = 0; i < 50;)
	{
		case4[i] = instantiate(22,base_large);
		if(BFS(case4[i]).path)
			i++;
	}
	for( var i = 50; i < 100;)
	{
		case4[i] = instantiate(23,base_large);
		if(BFS(case4[i]).path)
			i++;
	}
	var cases = [case1,case2,case3,case4];
	
	// now, run each set on each case
	var BFS_res = run_cases(BFS, cases);
	var DFS_res = run_cases(DFS, cases);
	var IDS_res = run_cases(IDS, cases);
	var GBFS_res = run_cases(GBFS, cases);
	var AS_res = run_cases(AS, cases);
	var HCS_res = run_cases(HCS, cases);

	return {
		BFS: BFS_res,
		DFS: DFS_res,
		IDS: IDS_res,
		GBFS: GBFS_res,
		AS: AS_res,
		HCS: HCS_res
		};

}

function print_csv(results)
{
	for(var alg in results) 
	{
		for(var i = 0; i < 4; i++)
			console.log(alg +' '+ i +' '+ results[alg][i].problems +' '+ results[alg][i].sec +' '+ results[alg][i].space +' '+ results[alg][i].time);
	}
}


function run_cases(find_path, cases)
{
	var results = [];
	for(i = 0; i < 4; i++)
	{
		results[i] = run_case(find_path, cases[i]);
	}
	return results;
}

function run_case(find_path, the_case)
{
	var res = {};
	res.space = 0;
	res.time = 0;
	res.sec = 0;
	res.problems = 100;
	var date = new Date();
	var start = date.getTime();
	for(var inst in the_case)
	{
		var path = find_path(the_case[inst]);
		res.space += path.space;
		res.time += path.visited;
	}
	date = new Date();
	var end = date.getTime();
	res.sec = end - start;
	res.space /= res.problems;
	res.time /= res.problems;

	return res;
}