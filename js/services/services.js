const Services = {
  tasks: {
    create: d => repos.tasks.create({ done: false, ...d }),
    toggle: (id, done) => repos.tasks.update(id, { done }),
    remove: id => repos.tasks.remove(id)
  },
  logs: {
    create: d => repos.logs.create(d),
    remove: id => repos.logs.remove(id)
  }
};
