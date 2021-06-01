import { forkJoin } from 'rxjs';
import { ajax } from 'rxjs/ajax';

describe('operators', () => {
  it('forkJoin', (complete) => {
    /*
      when all observables complete, provide the last
      emitted value from each as dictionary
    */
    forkJoin(
      // as of RxJS 6.5+ we can use a dictionary of sources
      [
        ajax.getJSON('https://api.github.com/users/google'),
        ajax.getJSON('https://api.github.com/users/microsoft'),
        ajax.getJSON('https://api.github.com/users'),
      ],
    )
      // [ googleObject, microsoftObject, usersArray ]
      .subscribe({
        next: console.log,
        complete,
      });
  });
});
