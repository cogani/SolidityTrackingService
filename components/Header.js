import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route="/">
        <a className="item">Supply chain</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Trackings</a>
        </Link>

        <Link route="/trackings/newTracking">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
