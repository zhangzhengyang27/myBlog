
class ACNode {
    constructor(data){
        this.data = data;
        this.children = new Map();
        this.isEndingChar = false;
        this.length = 0;
        this.fail = null;
    }
}

class ACTree {

    constructor(data){
        this.root = new ACNode('/')
    }

    insert (text) {
        let node = this.root;
        for (let char of text) {
            if(!node.children.get(char)) {
                node.children.set(char, new ACNode(char));
            }
            node = node.children.get(char);
        }

        node.isEndingChar = true;
        node.length = text.length;
    }

    buildFailurePointer() {
        let root = this.root;
        let queue = [];
        queue.push(root);

        while (queue.length > 0) {
            let p = queue.shift();

            for(var pc of p.children.values()){
                if (!pc) {
                    continue;
                } 

                if(p == root) {
                    pc.fail = root;
                } else {
                    let q = p.fail;
                    while (q) {
                        let qc = q.children.get(pc.data);
                        if(qc) {
                            pc.fail = qc;
                            break;
                        }
                        q = q.fail;
                    }
                    if(!q) {
                        pc.fail = root;
                    }
                }
                queue.push(pc);
            }
        }
    }

    match (text) {
        let root = this.root;
        let n = text.length;
        let p = root;

        for(let i = 0; i < n; i++) {
            let char = text[i];
            while(!p.children.get(char) && p != root){
                p = p.fail;
            }

            p = p.children.get(char);
            if(!p) {
                p = root;
            }

            let tmp = p;
            while ( tmp != root) {
                if (tmp.isEndingChar == true) {
                    console.log(`Start from ${i - p.length + 1}, length: ${p.length}`);
                }
                tmp = tmp.fail;
            }
        }
    }
}

function match( text, patterns) {
    let automata = new ACTree();
    for (let pattern of patterns) {
        automata.insert(pattern);
    }

    automata.buildFailurePointer();
    automata.match(text);
}

let patterns = ["at", "art", "oars", "soar"];
let text = "soarsoars";
match(text, patterns);

let patterns2 = ["Fxtec Pro1", "??????Pixel"];
let text2 = "?????????????????????????????????Fxtex???MWC???????????????????????????Fxtec Pro1???????????????????????????????????????????????????????????????????????????DxOMark?????????????????? ??????P20 Pro/??????Pixel 3??????";
match(text2, patterns2);

