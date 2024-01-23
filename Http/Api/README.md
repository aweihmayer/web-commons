# API
APIs should be structured in a standard way. The goal is to make things discoverable and not to overload an
class with too many endpoint methods. We should structure the methods with the context first and the technical
operation last.

Consider this as a bad example because a developer cannot discover things progressively.
```
api.createArticle
api.readArticle
api.updateArticle
api.deleteArticle
api.addArticleAuthor
api.removeArticleAuthor
etc...
```

A better approach would be to show users a smaller list of options to funnel them to want they want.
```
api.article.create
api.article.read
api.article.update
api.article.delete
api.article.author.add
api.article.author.remove
etc...
```