
function push_neighbors(instance, current, buf, source, visited, cost)
{
	for(var i = 0; i < 6; i++)
	{
		var adj = neighbor(current, i);
		// check that it exists
		if(!instance.nodes[adj])
			continue;
		// check that it's not blocked
		if(instance.edges[[current, adj]])
			continue;
		// this edge isn't new
		if(visited[adj])
			continue;

		source[adj] = current;
		var adj_cost = heuristic(instance, adj) + cost;
		buf.push({loc:adj, cost:adj_cost, integral: cost});
	}
}

function push_sorted_neighbors(instance, current, buf, source, visited, cost)
{
	var buf2 = [];

	for(var i = 0; i < 6; i++)
	{
		var adj = neighbor(current, i);
		// check that it exists
		if(!instance.nodes[adj])
			continue;
		// check that it's not blocked
		if(instance.edges[[current, adj]])
			continue;
		// this edge isn't new
		if(visited[adj])
			continue;

		source[adj] = current;
		var adj_cost = heuristic(instance, adj) + cost;
		buf2.push({loc:adj, cost:adj_cost, integral: cost});
	}
	buf2.sort(function(a,b){return b.cost-a.cost});
	buf = Array.prototype.push.apply(buf,buf2);
}

function create_path(instance, source)
{
	var path = [];
	var current = instance.end;

	while(source[current] != null)
	{	
		path.push(current);
		current = source[current];
	}
	path.push(current);
	return path;
}

function create_path_from(instance, source, current)
{
	var path = [];

	while(source[current] != null)
	{	
		path.push(current);
		current = source[current];
	}
	path.push(current);
	return path;
}

function heuristic(instance, current)
{
	return ( Math.abs(instance.end[0] - current[0]) +
		     Math.abs(instance.end[1] - current[1]) +
		     Math.abs(instance.end[2] - current[2]) ) / 2;
}

function BFS(instance)
{
	var current = instance.begin;
	var queue = [];
	var source = {};
	var visited = {};
	var max_frontier = 0;
	source[current] = null;
	visited[current] = true;
	push_neighbors(instance, current, queue, source, visited);

	while(queue.length > 0)
	{
		// instrumentation
		max_frontier = Math.max(max_frontier,queue.length);

		// we're done!
		if(visited[instance.end])
		{
			return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
		}
		current = queue.shift().loc;
		visited[current] = true;
		push_neighbors(instance, current, queue, source, visited);
	}
	// we're done!
	if(visited[instance.end])
	{
		return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
	}
	return false;
}

function DFS(instance, limit)
{
	var current = instance.begin;
	var stack = [];
	var source = {};
	var visited = {};
	var max_frontier = 0;
	source[current] = null;
	visited[current] = true;
	push_neighbors(instance, current, stack, source, visited);
	while(stack.length > 0)
	{
		// instrumentation
		max_frontier = Math.max(max_frontier, stack.length);

		// we're done!
		if(visited[instance.end])
		{
			return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
		}
		if(limit >= 0)
		{
			if(create_path_from(instance, source,current).length >= limit)
			{
				current = stack.pop().loc;
				continue;
			}
		}	
		current = stack.pop().loc;
		visited[current] = true;
		push_neighbors(instance, current, stack, source, visited);
	}
	// we're done!
	if(visited[instance.end])
	{
		return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
	}
	return {path:false, space: max_frontier, visited: Object.keys(visited).length};
}

function IDS(instance)
{
	var limit = 0;
	var max_frontier = 0;
	var sum_visited = 0;

	while(limit < instance.nodes.n * 2 - instance.edges.n)
	{ 
		var path = DFS(instance, limit);
		max_frontier = Math.max(max_frontier, path.space);
		sum_visited += path.visited;
		if(path.path)
			return {path: path.path, space:max_frontier,visited: sum_visited};
		limit++;
	}
}


function GBFS(instance)
{
	var current = instance.begin;
	var queue = [];
	var source = {};
	var visited = {};
	var max_frontier = 0;
	source[current] = null;
	visited[current] = true;
	push_neighbors(instance, current, queue, source, visited, 0);
	queue.sort(function(a,b){return b.cost - a.cost});
	while(queue.length > 0)
	{
		// instrumentation
		max_frontier = Math.max(max_frontier,queue.length);

		// we're done!
		if(visited[instance.end])
		{
			return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length}
		}
		current = queue.pop().loc;
		visited[current] = true;
		push_neighbors(instance, current, queue, source, visited, 0);
		queue.sort(function(a,b){return b.cost - a.cost});
	}
	// we're done!
	if(visited[instance.end])
	{
		return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
	}
	return false;
}

function AS(instance)
{
	var current = instance.begin;
	var queue = [];
	var source = {};
	var visited = {};
	var max_frontier = 0;
	var cost_step = 1;
	source[current] = null;
	visited[current] = true;
	push_neighbors(instance, current, queue, source, visited, cost_step);
	queue.sort(function(a,b){return b.cost-a.cost});
	while(queue.length > 0)
	{
		// instrumentation
		max_frontier = Math.max(max_frontier,queue.length);

		// we're done!
		if(visited[instance.end])
		{
			return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
		}
		var next = queue.pop();
		current = next.loc;
		visited[current] = true;
		push_neighbors(instance, current, queue, source, visited, next.integral +  cost_step);
		queue.sort(function(a,b){return b.cost - a.cost});
	}
	// we're done!
	if(visited[instance.end])
	{
		return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
	}
	return false;
}

function HCS(instance)
{
	var current = instance.begin;
	var queue = [];
	var source = {};
	var visited = {};
	var max_frontier = 0;
	source[current] = null;
	visited[current] = true;
	push_sorted_neighbors(instance, current, queue, source, visited, 0);
	while(queue.length > 0)
	{
		// instrumentation
		max_frontier = Math.max(max_frontier,queue.length);
		// we're done!
		if(visited[instance.end])
		{
			return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
		}
		current = queue.pop().loc;
		visited[current] = true;
		push_sorted_neighbors(instance, current, queue, source, visited, 0);
	}
	// we're done!
	if(visited[instance.end])
	{
		return {path:create_path(instance, source), space: max_frontier, visited: Object.keys(visited).length};
	}
	return false;
}
