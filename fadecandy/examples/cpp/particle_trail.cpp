#include "lib/effect_runner.h"
#include "particle_trail.h"

int main(int argc, char **argv)
{
    EffectRunner r;
    ParticleTrailEffect e;
    r.addEffect(&e);
    r.setLayout("../layouts/triangle16.json");
    return r.main(argc, argv);
}
