const template = document.createElement('template');
template.innerHTML = `
    <style>

    body {
        height: 400px;
    
    }
    
    *:not(style) {
        display: flex;
        flex:1;
        margin: 10px;
        border: 2px solid #28c9ac;
        draggable: true;
    }

        div {
            border-color: red;
        }

        span {
            border-color: green;
        }

        h1, h2, h3, h4, h5, h6 {
            border-color: yellow;
        }

        title {
            border-color: blue;
        }

        p {
            border-color: pink;
        }

        a {
            border-color: indigo;
        }

    </style>
`

class HtmlScraper extends HTMLElement {
    constructor() {
        super();
        //return the first element 'body'
        const body = document.querySelector('body');
        //create a shadow root
        this.attachShadow({ mode: 'open' });
        //add the elemnt to the shadow root of the DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        //create node tree
        const nodeTree = this.getNodeTree(body);
        //render the node tree and update the shadow root of DOM
        this.renderToHtml(nodeTree, this.shadowRoot);
    }

    getNodeTree(node) {
        if (node === this || node.nodeName === 'SCRIPT') return;
        if (node.children.length > 0) {
            //create array of children and use recursion
            const childrenArray = Array.from(node.children).map((child) => this.getNodeTree(child));
            return {
                nodeName: node.nodeName,
                parentName: node.parentNode.nodeName,
                childrenArray,
                content: node.innerText || "",
                element: node
            };
        }
        //return for node with no children
        return { nodeName: node.nodeName, element: node };
    }

    renderToHtml(nodeTree, parent) {
        if (!nodeTree) return;
        const newParent = document.createElement(nodeTree.nodeName);
        //show element name inside the box
        newParent.innerText = nodeTree.nodeName;
        // change opacity while hovering on the boxes
        if (newParent.nodeName !== 'BODY') {
            newParent.addEventListener('mouseenter', (_event) => {
                nodeTree.element.style.opacity = '.5';
            });

            newParent.addEventListener('mouseleave', (_event) => {
                nodeTree.element.style.opacity = '1';
            });
        }
        //if there are children, use recursion 
        if (nodeTree.childrenArray) {
            nodeTree.childrenArray.forEach(child => {
                this.renderToHtml(child, newParent);
                return;
            });
        }
        //update root shadow 
        parent.appendChild(newParent);
    }

}
window.customElements.define('html-scraper', HtmlScraper);

// here i tried the bonus question
/*class HtmlDragAndDrop extends HTMLElement
{
    constructor() {
        super();
    }

    var = dragValue;

    move(id){
        var element = document.getElementById(element.id)
        element.style.position = "absolute";
        element.onmousedown = function()
        {
            dragValue = element;
        }
        document.onmouseup = function(e){
            dragValue = null;
            HtmlScraper();
        }
        document.onmousemove = function(e){
            var x = e.pageX;
            var y = e.pageY;
    
            dragValue.style.left = x + "px";
            dragValue.style.top = y + "px";
        }
    }
}*/

