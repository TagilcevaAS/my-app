import React, { FC } from 'react';
import Menu from './Menu';
import User from './User';

const Sidebar: FC = () => {
    return <div>
        <User />
        <Menu />
    </div>
}

export default Sidebar