
export const Container = new class Container extends CjsComponent { constructor() { super((data) => {
    
    return `
        <div class="container"></div>
    `;
    });}

    data = { }; 
    
    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/root/_styles/Container.css';
}