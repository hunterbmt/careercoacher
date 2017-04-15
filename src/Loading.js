import React from 'react';
import logoOnly from './logo_only.png';

export default () =>
<div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '1 1 auto',
  height: '100%'
}}>
  <img alt='loading logo' src={logoOnly} className='App-logo'/>
</div>
