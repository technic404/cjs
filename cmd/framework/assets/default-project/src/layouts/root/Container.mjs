

export const Container = new class Container extends CjsComponent { constructor() { super((data) => {
    
    return `
        <div class="container"></div>
    `;
    });}
}

Container.importStyle('./src/layouts/root/_styles/Container.css');