import { familyProgress, type GameState, type ItemCatalog } from "@game/index";
import { ItemTile } from "./ItemTile";
import { themeForFamily } from "../presentation";

interface CollectionScreenProps {
  state: GameState;
  catalog: ItemCatalog;
  onClose: () => void;
}

export function CollectionScreen({ state, catalog, onClose }: CollectionScreenProps) {
  const families = familyProgress(catalog, state.collection);
  const discovered = state.collection.discoveredItemIds.length;
  const total = catalog.items().length;

  return (
    <section className="collection" aria-labelledby="collection-title">
      <header className="collection-head">
        <div>
          <p className="eyebrow">Looks</p>
          <h2 id="collection-title">Collection</h2>
          <p className="collection-progress">
            {discovered} / {total} discovered
          </p>
        </div>
        <button type="button" className="btn" onClick={onClose}>
          Back to board
        </button>
      </header>
      <div className="collection-list">
        {families.map((entry) => {
          const theme = themeForFamily(entry.family.id);
          return (
            <article key={entry.family.id} className="collection-family">
              <header>
                <h3 style={{ color: theme.accent }}>
                  <span aria-hidden="true">{theme.mark} </span>
                  {entry.family.name}
                </h3>
                <p>
                  {entry.discovered} / {entry.total} discovered
                </p>
              </header>
              <ol>
                {entry.entries.map((tier) => (
                  <li key={tier.item.id}>
                    {tier.discovered ? (
                      <ItemTile item={tier.item} size="collection" />
                    ) : (
                      <ItemTile
                        item={null}
                        locked
                        lockedTier={tier.item.tier}
                        size="collection"
                      />
                    )}
                    <span className="collection-caption">
                      {tier.discovered ? tier.item.name : `Tier ${tier.item.tier}`}
                    </span>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </section>
  );
}
