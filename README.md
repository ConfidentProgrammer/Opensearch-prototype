# Opensearch-prototype
A basic prototype of an inverted index search engine to understand how OpenSearch works internally. It tokenizes words, builds an index, and supports search queries. While not as efficient as OpenSearch itself, I optimized it as much as possible for learning purposes. Handles large text files by splitting them into chunks. 🚀

# 🚀 What this prototype does:

Processes documents by tokenizing words and counting occurrences.
Builds an inverted index for efficient term-based searching.
Handles large text files by splitting them into manageable chunks.
⚠️ Note: This is a prototype and may not be as efficient as OpenSearch or Elasticsearch itself. However, I have optimized it as much as possible within the scope of this learning project.

This project serves as a learning tool rather than a production-ready search engine. 🚀

##Usage
node opensearch.js searchterm


User@Mac Prototypes % node opensearch.js bottle
Time: 331.705ms
[
    3465,  20017,  20475,  20477,  20478,
   20499,  20649,  20843,  21643,  21644,
   21647,  22625,  22628,  22631,  32746,
   48303,  48311,  48765,  48767,  49330,
   59704,  78827,  83159,  86303,  87126,
   90908, 105796, 105823, 105837, 105871,
  105873, 105879, 105910, 105935, 106109,
  106128, 106459
]



User@Mac Prototypes % node opensearch.js charger
Time: 333.039ms
[]
