var Reflux =      require('reflux');
var User =        require('actions/user');
var pick =        require('lodash-node/modern/objects/pick');
var map =         require('lodash-node/modern/collections/map');
var cache =       require('mixins/cache');

module.exports = Reflux.createStore({
  init() {
    this.listenTo(User.search.completed, this.onCompleted);
    this.listenTo(User.search.failed, this.onFailed);
  },

  onCompleted(query, data) {
    data = this.trimData(data);
    cache.setItem(JSON.stringify(query), data);

    this.trigger({
      results: data,
      query: query
    });
  },

  onFailed(query, xhr) {
    this.trigger({
      results: {
        items: [],
        error: JSON.parse(xhr.responseText)
      },
      query: query
    });
  },

  trimData(data) {
    data = pick(data, 'items', 'total_count');
    data.items = map(data.items, item => {
      return pick(item, 'avatar_url', 'id', 'login');
    });
    return data;
  }
});