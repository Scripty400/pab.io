define(
  ["../exception","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Exception = __dependency1__["default"];

    function ProgramNode(statements, inverseStrip, inverse) {
      this.type = "program";
      this.statements = statements;
      this.strip = {};

      if(inverse) {
        this.inverse = new ProgramNode(inverse, inverseStrip);
        this.strip.right = inverseStrip.left;
      } else if (inverseStrip) {
        this.strip.left = inverseStrip.right;
      }
    }

    __exports__.ProgramNode = ProgramNode;function MustacheNode(rawParams, hash, open, strip) {
      this.type = "mustache";
      this.hash = hash;
      this.strip = strip;

      var escapeFlag = open[3] || open[2];
      this.escaped = escapeFlag !== '{' && escapeFlag !== '&';

      var id = this.id = rawParams[0];
      var params = this.params = rawParams.slice(1);

      // a mustache is an eligible helper if:
      // * its id is simple (a single part, not `this` or `..`)
      var eligibleHelper = this.eligibleHelper = id.isSimple;

      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      this.isHelper = eligibleHelper && (params.length || hash);

      // if a mustache is an eligible helper but not a definite
      // helper, it is ambiguous, and will be resolved in a later
      // pass or at runtime.
    }

    __exports__.MustacheNode = MustacheNode;function PartialNode(partialName, context, strip) {
      this.type         = "partial";
      this.partialName  = partialName;
      this.context      = context;
      this.strip = strip;
    }

    __exports__.PartialNode = PartialNode;function BlockNode(mustache, program, inverse, close) {
      if(mustache.id.original !== close.path.original) {
        throw new Exception(mustache.id.original + " doesn't match " + close.path.original);
      }

      this.type = "block";
      this.mustache = mustache;
      this.program  = program;
      this.inverse  = inverse;

      this.strip = {
        left: mustache.strip.left,
        right: close.strip.right
      };

      (program || inverse).strip.left = mustache.strip.right;
      (inverse || program).strip.right = close.strip.left;

      if (inverse && !program) {
        this.isInverse = true;
      }
    }

    __exports__.BlockNode = BlockNode;function ContentNode(string) {
      this.type = "content";
      this.string = string;
    }

    __exports__.ContentNode = ContentNode;function HashNode(pairs) {
      this.type = "hash";
      this.pairs = pairs;
    }

    __exports__.HashNode = HashNode;function IdNode(parts) {
      this.type = "ID";

      var original = "",
          dig = [],
          depth = 0;

      for(var i=0,l=parts.length; i<l; i++) {
        var part = parts[i].part;
        original += (parts[i].separator || '') + part;

        if (part === ".." || part === "." || part === "this") {
          if (dig.length > 0) { throw new Exception("Invalid path: " + original); }
          else if (part === "..") { depth++; }
          else { this.isScoped = true; }
        }
        else { dig.push(part); }
      }

      this.original = original;
      this.parts    = dig;
      this.string   = dig.join('.');
      this.depth    = depth;

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

      this.stringModeValue = this.string;
    }

    __exports__.IdNode = IdNode;function PartialNameNode(name) {
      this.type = "PARTIAL_NAME";
      this.name = name.original;
    }

    __exports__.PartialNameNode = PartialNameNode;function DataNode(id) {
      this.type = "DATA";
      this.id = id;
    }

    __exports__.DataNode = DataNode;function StringNode(string) {
      this.type = "STRING";
      this.original =
        this.string =
        this.stringModeValue = string;
    }

    __exports__.StringNode = StringNode;function IntegerNode(integer) {
      this.type = "INTEGER";
      this.original =
        this.integer = integer;
      this.stringModeValue = Number(integer);
    }

    __exports__.IntegerNode = IntegerNode;function BooleanNode(bool) {
      this.type = "BOOLEAN";
      this.bool = bool;
      this.stringModeValue = bool === "true";
    }

    __exports__.BooleanNode = BooleanNode;function CommentNode(comment) {
      this.type = "comment";
      this.comment = comment;
    }

    __exports__.CommentNode = CommentNode;
  });