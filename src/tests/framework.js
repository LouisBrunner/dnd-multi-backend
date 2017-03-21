import chai from 'chai';
import sinon from 'sinon';
import { mount, shallow, render } from 'enzyme';

import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(sinonChai);
chai.use(chaiEnzyme());

const expect = chai.expect;

export { chai, expect, sinon, mount, shallow, render };
