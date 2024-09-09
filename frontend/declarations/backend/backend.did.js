export const idlFactory = ({ IDL }) => {
  const ShoppingItem = IDL.Record({
    'id' : IDL.Nat,
    'completedAt' : IDL.Opt(IDL.Int),
    'name' : IDL.Text,
    'completed' : IDL.Bool,
  });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'deleteItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getItems' : IDL.Func([], [IDL.Vec(ShoppingItem)], ['query']),
    'toggleItemComplete' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
