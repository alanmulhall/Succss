/**
 * @file
 * This file is used to selftest configuration error messages.
 * 
 * @see selftests/run-errors.sh
 * 
 */

Succss.pages = {
  'goodPage': {
    'url': 'succss.ifzenelse.net',
  },
  'badUrl': {
    'url': 'sucs.ifzenelse.net',
  },
  'badSelector': {
    'url': 'succss.ifzenelse.net',
    'captures': {
      'fakeElement':'',
    }
  },
}
