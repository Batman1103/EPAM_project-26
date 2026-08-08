#include <bits/stdc++.h>
using namespace std;

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M, D;
    cin >> N >> M >> D;

    vector<vector<int>> graph(N + 1);

    for (int i = 0; i < M; i++)
    {
        int u, v;
        cin >> u >> v;

        graph[u].push_back(v);
        graph[v].push_back(u);
    }

    vector<int> distance(N + 1, -1);

    queue<int> q;

    distance[1] = 0;
    q.push(1);

    while (!q.empty())
    {

        int city = q.front();
        q.pop();

        for (int next : graph[city])
        {

            if (distance[next] == -1)
            {

                distance[next] = distance[city] + 1;

                q.push(next);
            }
        }
    }

    int answer = 0;

    for (int i = 1; i <= N; i++)
    {

        if (distance[i] != -1 && distance[i] <= D)
        {
            answer++;
        }
    }

    cout << answer << '\n';

    return 0;
}