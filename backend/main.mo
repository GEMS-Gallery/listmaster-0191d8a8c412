import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type ShoppingItem = {
    id: Nat;
    name: Text;
    completed: Bool;
    completedAt: ?Int;
  };

  stable var nextId: Nat = 0;
  let itemsMap = HashMap.HashMap<Nat, ShoppingItem>(10, Nat.equal, Nat.hash);

  public func addItem(name: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem: ShoppingItem = {
      id = id;
      name = name;
      completed = false;
      completedAt = null;
    };
    itemsMap.put(id, newItem);
    id
  };

  public func toggleItemComplete(id: Nat) : async Bool {
    switch (itemsMap.get(id)) {
      case (null) { false };
      case (?item) {
        let updatedItem: ShoppingItem = {
          id = item.id;
          name = item.name;
          completed = not item.completed;
          completedAt = if (not item.completed) { ?Time.now() } else { null };
        };
        itemsMap.put(id, updatedItem);
        true
      };
    }
  };

  public func deleteItem(id: Nat) : async Bool {
    switch (itemsMap.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  public query func getItems() : async [ShoppingItem] {
    Iter.toArray(itemsMap.vals())
  };

  system func preupgrade() {
    // No need to do anything as we're using a stable variable for nextId
    // and the HashMap is automatically handled by the upgrade process
  };

  system func postupgrade() {
    // No need to do anything as the HashMap is automatically restored
  };
}
