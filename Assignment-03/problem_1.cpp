#include <bits/stdc++.h>
using namespace std;

int main(){
    int N;
    long long B;
    cin>>N>>B;
    vector<int>scholarship(N);
    for(int i=0;i<N;i++){
        cin>>scholarship[i];
    }
    sort(scholarship.begin(),scholarship.end());
    long long temp=B;
    int count=0;
    int i=0;
    while(i<N){
        if(scholarship[i]<=temp){
            count++;
            temp-=scholarship[i];
        }
        i++;
    }
    cout<<count<<endl;
    return 0;
}