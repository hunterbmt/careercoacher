import React, { Component } from 'react';
import { LocaleProvider } from 'antd';
import _ from 'lodash';
import Router from 'react-router-component';
import enUS from 'antd/lib/locale-provider/en_US';
import MainPage from './MainPage';
import SelfAssessment from './SelfAssessment';
import CompareAssessment from './CompareAssessment';
import FinishPage from './FinishPage';
import ProfilePage from './ProfilePage';
import GroupManagement from './GroupManagement';
import BaselineManagementPage from './BaselineManagementPage';
import './App.css';
import SetWeight from './SetWeight';
import Competencies from './Competencies'
import QuestionCompetency from './QuestionCompetency'
import PersonalProfile from './PersonalProfile'
import Login from './Login'
import GroupManagementForManager from './GroupManagementForManager'


import './App.css';
import './ant-custom.css';

const Locations = Router.Locations;
const Location = Router.Location;

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Locations hash style={{height: '100%'}}>
          <Location path='/' handler={MainPage} />
          <Location path='/personal/:id' handler={PersonalProfile} />
          <Location path='/finish' handler={FinishPage} />
          <Location path='/selfassessment/:name' handler={SelfAssessment} />
          <Location path='/compare/:name/final' handler={SelfAssessment} />
          <Location path='/:manager/assessment/:name' handler={SelfAssessment} />
          <Location path='/compare/:name' handler={CompareAssessment} />
          <Location path='/profiles/:profile' handler={ProfilePage} />
          <Location path='/projects/:project' handler={GroupManagement} />
          <Location path='/roleProfile' handler={BaselineManagementPage} />
          <Location path='/competencies/:option/:index/:level' handler={SetWeight} />
          <Location path='/competencies' handler={Competencies} />
          <Location path='/competencies1/:option/:index' handler={QuestionCompetency} />
          <Location path='/login' handler={Login}/>
          <Location path='/project/:id' handler={GroupManagementForManager}/>
        </Locations>
      </LocaleProvider>
    );
  }
}

export default App;
