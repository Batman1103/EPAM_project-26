#include <bits/stdc++.h>
using namespace std;

int main()
{

    int N;
    long long K;

    cin >> N >> K;

    vector<long long> value(N + 1);

    for (int i = 1; i <= N; i++)
    {
        cin >> value[i];
    }

    vector<vector<int>> adj(N + 1);

    for (int i = 0; i < N - 1; i++)
    {

        int u, v;
        cin >> u >> v;

        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int answer = 0;

    stack<tuple<int, int, long long>> st;

    st.push({1, 0, 0});

    while (!st.empty())
    {

        auto [node, parent, pathXor] = st.top();
        st.pop();

        pathXor ^= value[node];

        if (pathXor >= K)
        {
            answer++;
        }

        for (int next : adj[node])
        {

            if (next == parent)
                continue;

            st.push({next, node, pathXor});
        }
    }

    cout << answer << endl;

    return 0;
}